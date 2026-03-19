import express from "express";
import cors from "cors";
import admin from "firebase-admin";

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.warn(
    "WARNING: GOOGLE_APPLICATION_CREDENTIALS is not set. Set it to the path of your Firebase service account JSON."
  );
}

try {
  admin.initializeApp();
} catch (error) {
  console.warn("Firebase Admin could not initialize (maybe already initialized):", error);
}

const db = admin.firestore();

app.get("/", (_req, res) => res.json({ status: "up", message: "Smart backend" }));

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

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
