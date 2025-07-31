// firebase-admin-test.js
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Για emulator testing
process***REMOVED***.FIRESTORE_EMULATOR_HOST = "localhost:8080";

try {
  const app = initializeApp({ projectId: "demo-test" });
  const db = getFirestore(app);

  // Test basic operations
  async function testFirestore() {
    // Test write
    await db.collection("test").doc("connection").set({
      timestamp: new Date(),
      status: "connected",
    });

    // Test read
    const doc = await db.collection("test").doc("connection").get();
    if (doc.exists) {
      console.log("✅ Firestore read/write test successful");
      process.exit(0);
    } else {
      console.log("❌ Firestore read test failed");
      process.exit(1);
    }
  }

  testFirestore().catch((error) => {
    console.log("❌ Firestore test failed:", error.message);
    process.exit(1);
  });
} catch (error) {
  console.log("❌ Firestore initialization failed:", error.message);
  process.exit(1);
}
