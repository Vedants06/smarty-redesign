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
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.warn("WARNING: GOOGLE_APPLICATION_CREDENTIALS is not set.");
}
try {
  admin.initializeApp();
} catch (error) {
  console.warn("Firebase Admin could not initialize:", error);
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
        // returnUrl comes from frontend so it knows its own base path
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

    // Save pending order to Firestore
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

// ─── Verify payment (called by frontend after redirect) ───────────────────────
// This is the primary unlock mechanism since webhooks don't work on localhost
app.get("/verify-payment/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Ask Cashfree if this order is actually paid
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

// ─── Shared helper: grant course access in Firestore ─────────────────────────
async function grantCourseAccess(orderId) {
  const orderDoc = await db.collection("orders").doc(orderId).get();
  if (!orderDoc.exists) {
    console.warn("Order not found in Firestore:", orderId);
    return;
  }

  const { userId, courseId, status } = orderDoc.data();

  // Idempotent — skip if already processed
  if (status === "paid") {
    console.log(`Order ${orderId} already processed`);
    return;
  }

  // Mark order as paid
  await db.collection("orders").doc(orderId).update({
    status: "paid",
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Add courseId to user's purchasedCourses array
  await db.collection("users").doc(userId).set({
    purchasedCourses: admin.firestore.FieldValue.arrayUnion(courseId),
    updatedAt:        admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`✅ Course ${courseId} unlocked for user ${userId}`);
}

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});