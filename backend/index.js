import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import crypto from "crypto";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── Firebase Admin ──────────────────────────────────────────────────────────

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Railway — JSON string in env var
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log("Firebase initialized via FIREBASE_SERVICE_ACCOUNT");
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Local dev — path to JSON file
    admin.initializeApp();
    console.log("Firebase initialized via GOOGLE_APPLICATION_CREDENTIALS");
  } else {
    console.warn("WARNING: No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.");
    admin.initializeApp();
  }
} catch (error) {
  console.warn("Firebase Admin could not initialize:", error.message);
}

const db = admin.firestore();

// ─── Cashfree Config ─────────────────────────────────────────────────────────
const CF_APP_ID   = process.env.CASHFREE_APP_ID;
const CF_SECRET   = process.env.CASHFREE_SECRET_KEY;
const CF_ENV      = process.env.CASHFREE_ENV || "sandbox";
const CF_BASE_URL = CF_ENV === "production"
  ? "https://api.cashfree.com/pg"
  : "https://sandbox.cashfree.com/pg";
const CF_VERSION  = "2023-08-01";

// ─── Health ──────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => res.json({ status: "up", message: "Smarty backend" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── Save / update user in Firestore ─────────────────────────────────────────
app.post("/user", async (req, res) => {
  try {
    const { uid, email, name } = req.body;
    if (!uid || !email) return res.status(400).json({ error: "uid/email required" });

    await db.collection("users").doc(uid).set({
      uid,
      email,
      name: name || "",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Create Cashfree Order ────────────────────────────────────────────────────
app.post("/create-order", async (req, res) => {
  try {
    const { courseId, userId, userEmail, userName, courseTitle, price, returnUrl } = req.body;

    if (!courseId || !userId || !price) {
      return res.status(400).json({ error: "courseId, userId, and price are required" });
    }

    const orderId = `order_${courseId}_${userId}_${Date.now()}`;

    const orderPayload = {
      order_id:       orderId,
      order_amount:   parseFloat(price),
      order_currency: "INR",
      order_note:     `Purchase: ${courseTitle}`,
      customer_details: {
        customer_id:    userId,
        customer_email: userEmail  || "student@smarty.com",
        customer_name:  userName   || "Student",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: returnUrl || `${process.env.FRONTEND_URL}/course/${courseId}?payment=success&order_id={order_id}`,
        notify_url: `${process.env.BACKEND_URL}/webhook/cashfree`,
      },
    };

    const cfRes = await fetch(`${CF_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "x-api-version":   CF_VERSION,
        "x-client-id":     CF_APP_ID,
        "x-client-secret": CF_SECRET,
      },
      body: JSON.stringify(orderPayload),
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok) {
      console.error("Cashfree order creation failed:", cfData);
      return res.status(500).json({ error: cfData.message || "Failed to create order" });
    }

    await db.collection("orders").doc(orderId).set({
      orderId,
      courseId,
      userId,
      amount: parseFloat(price),
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      orderId:          cfData.order_id,
      paymentSessionId: cfData.payment_session_id,
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Cashfree Webhook ─────────────────────────────────────────────────────────
app.post("/webhook/cashfree", async (req, res) => {
  try {
    const rawBody   = JSON.stringify(req.body);
    const timestamp = req.headers["x-webhook-timestamp"];
    const signature = req.headers["x-webhook-signature"];

    const signedPayload = timestamp + rawBody;
    const expectedSig   = crypto
      .createHmac("sha256", CF_SECRET)
      .update(signedPayload)
      .digest("base64");

    if (expectedSig !== signature) {
      console.warn("Webhook signature mismatch — ignoring");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const event = req.body;
    if (event?.data?.payment?.payment_status === "SUCCESS") {
      const orderId = event.data.order.order_id;
      await grantCourseAccess(orderId);
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Verify payment ───────────────────────────────────────────────────────────
app.get("/verify-payment/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const cfRes = await fetch(`${CF_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-api-version":   CF_VERSION,
        "x-client-id":     CF_APP_ID,
        "x-client-secret": CF_SECRET,
      },
    });

    const cfData = await cfRes.json();
    console.log(`Verify payment for ${orderId}:`, cfData.order_status);

    if (cfData.order_status === "PAID") {
      await grantCourseAccess(orderId);
      return res.json({ status: "paid" });
    }

    res.json({ status: cfData.order_status?.toLowerCase() || "pending" });

  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Shared helper: grant course access ──────────────────────────────────────
const ALL_COURSE_IDS = [1, 2, 3, 4, 5, 6];

async function grantCourseAccess(orderId) {
  const orderDoc = await db.collection("orders").doc(orderId).get();
  if (!orderDoc.exists) {
    console.warn("Order not found in Firestore:", orderId);
    return;
  }

  const { userId, courseId, status } = orderDoc.data();

  if (status === "paid") {
    console.log(`Order ${orderId} already processed`);
    return;
  }

  await db.collection("orders").doc(orderId).update({
    status: "paid",
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const coursesToUnlock = courseId === "all" ? ALL_COURSE_IDS : [courseId];

  await db.collection("users").doc(userId).set({
    purchasedCourses: admin.firestore.FieldValue.arrayUnion(...coursesToUnlock),
    ...(courseId === "all" && { plan: "pro" }),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`✅ Unlocked courses [${coursesToUnlock}] for user ${userId}`);
}

// ─── Create Pro Order ─────────────────────────────────────────────────────────
app.post("/create-pro-order", async (req, res) => {
  try {
    const { userId, userEmail, userName, returnUrl } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required" });

    const orderId = `pro_${userId}_${Date.now()}`;

    const orderPayload = {
      order_id:       orderId,
      order_amount:   19,
      order_currency: "INR",
      order_note:     "Smarty Pro — All Courses Access",
      customer_details: {
        customer_id:    userId,
        customer_email: userEmail  || "student@smarty.com",
        customer_name:  userName   || "Student",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: returnUrl || `${process.env.FRONTEND_URL}/?pro=success&order_id={order_id}`,
        notify_url: `${process.env.BACKEND_URL}/webhook/cashfree`,
      },
    };

    const cfRes = await fetch(`${CF_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "x-api-version":   CF_VERSION,
        "x-client-id":     CF_APP_ID,
        "x-client-secret": CF_SECRET,
      },
      body: JSON.stringify(orderPayload),
    });

    const cfData = await cfRes.json();
    if (!cfRes.ok) {
      console.error("Cashfree pro order failed:", cfData);
      return res.status(500).json({ error: cfData.message || "Failed to create order" });
    }

    await db.collection("orders").doc(orderId).set({
      orderId,
      courseId: "all",
      userId,
      amount: 19,
      status: "pending",
      plan:   "pro",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      orderId:          cfData.order_id,
      paymentSessionId: cfData.payment_session_id,
    });

  } catch (error) {
    console.error("Create pro order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Verify Pro Payment ───────────────────────────────────────────────────────
app.get("/verify-pro-payment/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const cfRes = await fetch(`${CF_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-api-version":   CF_VERSION,
        "x-client-id":     CF_APP_ID,
        "x-client-secret": CF_SECRET,
      },
    });

    const cfData = await cfRes.json();
    console.log(`Verify pro payment for ${orderId}:`, cfData.order_status);

    if (cfData.order_status === "PAID") {
      await grantCourseAccess(orderId);
      return res.json({ status: "paid" });
    }

    res.json({ status: cfData.order_status?.toLowerCase() || "pending" });

  } catch (error) {
    console.error("Verify pro payment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});