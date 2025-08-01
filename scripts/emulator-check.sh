firebase emulators:start --only firestore,functions --inspect-functions &  
EMULATOR_PID=$!

# Βρόχος αναμονής για το emulator να ανταποκριθεί
timeout=30
while ! curl --silent --fail http://localhost:8081 >/dev/null 2>&1 && [ $timeout -gt 0 ]; do
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -eq 0 ]; then
  echo "❌ Firestore emulator δεν ανταποκρίνεται μετά από 30 δευτερόλεπτα!"
  kill $EMULATOR_PID || true
  exit 1
fi

echo "✅ Firestore emulator ανταποκρίνεται, συνεχίζουμε…"

# Εδώ συνεχίζεις με τα επόμενα βήματα (tests, build, deploy...)

# Στο τέλος κάνεις cleanup
kill $EMULATOR_PID || true
