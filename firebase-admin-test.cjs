process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8081";

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({ projectId: "tasia-6f77i" });
const db = getFirestore(app);

async function testConnection() {
  try {
    await db.collection("test").doc("connection").set({
      status: "connected",
      timestamp: new Date(),
    });

    const doc = await db.collection("test").doc("connection").get();
    if (doc.exists) {
      console.log("✅ Firestore emulator is working:", doc.data());
    } else {
      console.log("❌ Document not found.");
    }
  } catch (err) {
    console.error("🔥 Connection failed:", err.message);
  }
}

testConnection();
