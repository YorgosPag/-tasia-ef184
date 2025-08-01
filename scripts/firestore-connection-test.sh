#!/usr/bin/env bash

# Βήμα 10: Έλεγχος σύνδεσης Firestore emulator & βασικά operations

set -e

echo "🚦 Βήμα 10: Έλεγχος Firestore emulator σύνδεσης..."

firebase emulators:start --only firestore --project demo-test &>/tmp/firestore-test.log &
FIRESTORE_TEST_PID=$!

# Περιμένουμε τον emulator να ξεκινήσει
timeout=30
while ! curl --silent --fail http://127.0.0.1:8080 >/dev/null && [ $timeout -gt 0 ]; do
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -eq 0 ]; then
  echo "❌ Could not start Firestore emulator for testing!"
  kill $FIRESTORE_TEST_PID || true
  exit 1
fi

echo "✅ Firestore emulator started for connection testing."

if [ -f "firebase-admin-test.js" ]; then
  echo "ℹ️  Running Firestore connection test..."
  node firebase-admin-test.js && echo "✅ Firestore operations test passed."
else
  echo "ℹ️  No Firestore connection test file found. Consider adding firebase-admin-test.js"
fi

if grep -r "initializeApp\|getFirestore" src/ >/dev/null 2>&1; then
  echo "✅ Firebase/Firestore initialization found in source code."
else
  echo "⚠️  No Firebase/Firestore initialization found in src/. Make sure Firebase is properly configured."
fi

ENV_VARS_FOUND=0
for env_file in .env .env.local .env.development .env.production; do
  if [ -f "$env_file" ]; then
    if grep -q "FIREBASE\|NEXT_PUBLIC_FIREBASE" "$env_file"; then
      echo "✅ Firebase config found in $env_file"
      ENV_VARS_FOUND=1
    fi
  fi
done

if [ $ENV_VARS_FOUND -eq 0 ]; then
  echo "⚠️  No Firebase environment variables found. Make sure Firebase config is set."
fi

kill $FIRESTORE_TEST_PID || true
sleep 3
echo "✅ Firestore connection tests completed."
