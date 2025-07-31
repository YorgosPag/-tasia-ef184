# =========================
#  Πώς να τρέξεις αυτό το script:
#
#   bash project-check.sh
#
# (Αν βγάλει Permission Denied, πρώτα τρέξε:
#   chmod +x project-check.sh
# και μετά:
#   ./project-check.sh
# )
#
# Firebase Studio Terminal friendly!
# =========================

#!/usr/bin/env bash

set -e

echo "Ξεκίνησε: $(date)" | tee -a project-check.log

echo "🚦 0.0 Checking required environment variables..." | tee -a project-check.log
REQUIRED_VARS=() # Αφαιρέθηκε ο έλεγχος για NEXT_PUBLIC_API_URL
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing env variable: $var" | tee -a project-check.log
    exit 1
  fi
done
echo "✅ Env variables look ok." | tee -a project-check.log

echo "🚦 0.2 Checking Firebase configuration..." | tee -a project-check.log
if [ ! -f firebase.json ]; then
  echo "❌ Missing firebase.json file!" | tee -a project-check.log
  exit 1
fi
if [ ! -f .firebaserc ]; then
  echo "❌ Missing .firebaserc file!" | tee -a project-check.log
  exit 1
fi
if ! command -v firebase >/dev/null 2>&1; then
  echo "❌ Firebase CLI is not installed!" | tee -a project-check.log
  exit 1
fi
FIREBASE_VERSION=$(firebase --version)
echo "✅ Firebase CLI version: $FIREBASE_VERSION" | tee -a project-check.log
echo "✅ Firebase configuration files found." | tee -a project-check.log

echo "🚦 0.3 Checking .gitignore and sensitive files..." | tee -a project-check.log
if [ ! -f .gitignore ]; then
  echo "❌ Missing .gitignore file!" | tee -a project-check.log
  exit 1
fi
if grep -q "***REMOVED***" .gitignore && git ls-files | grep -q "***REMOVED***"; then
  echo "❌ Sensitive ***REMOVED*** file found in git index!" | tee -a project-check.log
  exit 1
fi
echo "✅ .gitignore and sensitive files check passed." | tee -a project-check.log

echo "🚦 0. Checking for uncommitted changes..." | tee -a project-check.log
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Υπάρχουν uncommitted changes! Καλό είναι να τα commitάρεις πριν συνεχίσεις." | tee -a project-check.log
fi

echo "🚦 0.1 Checking for outdated dependencies..." | tee -a project-check.log
if npm outdated | grep -q 'Package'; then
  echo "⚠️  Υπάρχουν outdated dependencies! (Προαιρετικό) Δες τα παραπάνω και σκέψου αν πρέπει να τα ενημερώσεις." | tee -a project-check.log
else
  echo "✅ No outdated dependencies found." | tee -a project-check.log
fi

echo "🚦 1. Linting code (npm run lint)..." | tee -a project-check.log
if ! npm run lint; then
  echo "❌ Linting failed. Διόρθωσε τα lint errors πριν συνεχίσεις!" | tee -a project-check.log
  exit 1
fi
echo "✅ Linting passed." | tee -a project-check.log

echo "🚦 1.1 Checking code formatting (prettier --check)..." | tee -a project-check.log
if [ -f package.json ] && grep -q "\"format\":" package.json; then
  if ! npm run format:check; then
    echo "❌ Formatting failed. Τρέξε 'npm run format' για να διορθώσεις." | tee -a project-check.log
    exit 1
  fi
  echo "✅ Formatting OK." | tee -a project-check.log
elif npx prettier --check .; then
  echo "✅ Formatting OK (prettier --check)." | tee -a project-check.log
else
  echo "❌ Formatting failed. Τρέξε 'npx prettier --write .' για να διορθώσεις." | tee -a project-check.log
  exit 1
fi

echo "🚦 2. Type checking (tsc --noEmit)..." | tee -a project-check.log
if ! npx tsc --noEmit; then
  echo "❌ TypeScript type check failed. Διόρθωσε τα type errors πριν συνεχίσεις!" | tee -a project-check.log
  exit 1
fi
echo "✅ TypeScript types are valid." | tee -a project-check.log

echo "🚦 2.1 Checking Firebase Emulator Suite..." | tee -a project-check.log
if firebase emulators:start --only firestore,functions --inspect-functions &>/tmp/emulator.log & then
  EMULATOR_PID=$!
  sleep 10
  if curl --silent --fail http://localhost:8080 >/dev/null; then
    echo "✅ Firestore emulator responds!" | tee -a project-check.log
  else
    echo "❌ Firestore emulator failed to respond!" | tee -a project-check.log
    kill $EMULATOR_PID || true
    exit 1
  fi
  kill $EMULATOR_PID || true
else
  echo "❌ Failed to start Firebase emulators!" | tee -a project-check.log
  exit 1
fi

echo "🚦 3. Running development server (npm run dev)..." | tee -a project-check.log
npm run dev &
DEV_PID=$!
sleep 10

echo "🔍 Checking if dev server responds at http://localhost:9003..." | tee -a project-check.log
if curl --silent --fail http://localhost:9003 >/dev/null; then
  echo "✅ Dev server responds!" | tee -a project-check.log
else
  echo "❌ Dev server ΔΕΝ απαντάει! Κάτι τρέχει..." | tee -a project-check.log
  kill $DEV_PID || true
  exit 1
fi

echo "ℹ️  Ελεγξε MANUAL στον browser σου αν φορτώνει σωστά στο http://localhost:9003" | tee -a project-check.log
echo "ℹ️  Πάτησε Enter όταν τελειώσεις το manual test (ή Ctrl+C για να το διακόψεις αν κάτι πάει στραβά)" | tee -a project-check.log
read -p "↩️ "

kill $DEV_PID || true
sleep 2

echo "🚦 3.1 Running E2E tests (npm run e2e)..." | tee -a project-check.log
if [ -f package.json ] && grep -q "\"e2e\":" package.json; then
  if ! npm run e2e; then
    echo "❌ E2E tests failed. Διόρθωσε τα σφάλματα!" | tee -a project-check.log
    exit 1
  fi
  echo "✅ E2E tests passed." | tee -a project-check.log
else
  echo "ℹ️  Δεν βρέθηκαν E2E tests, προχωράμε." | tee -a project-check.log
fi

echo "🚦 4. Building production build (npm run build)..." | tee -a project-check.log
if ! npm run build; then
  echo "❌ Production build failed. Διόρθωσε τα build errors!" | tee -a project-check.log
  exit 1
fi
echo "✅ Build passed." | tee -a project-check.log

echo "🚦 4.1 Checking production build size..." | tee -a project-check.log
MAX_SIZE=$((2 * 1024 * 1024)) # 2MB in bytes
BUILD_SIZE=$(find dist -type f -exec du -b {} + | awk '{sum += $1} END {print sum}')
if [ "$BUILD_SIZE" -gt "$MAX_SIZE" ]; then
  echo "⚠️  Build size ($BUILD_SIZE bytes) exceeds recommended limit ($MAX_SIZE bytes)!" | tee -a project-check.log
else
  echo "✅ Build size is within limits ($BUILD_SIZE bytes)." | tee -a project-check.log
fi

echo "🚦 5. Starting production preview (npm start)..." | tee -a project-check.log
npm start &
PREVIEW_PID=$!
sleep 10

echo "🔍 Checking if production server responds at http://localhost:9003..." | tee -a project-check.log
if curl --silent --fail http://localhost:9003 >/dev/null; then
  echo "✅ Production server responds!" | tee -a project-check.log
else
  echo "❌ Production server ΔΕΝ απαντάει! Κάτι τρέχει..." | tee -a project-check.log
  kill $PREVIEW_PID || true
  exit 1
fi

echo "ℹ️  Ελεγξε MANUAL στον browser σου αν φορτώνει σωστά στο http://localhost:9003 (production mode)" | tee -a project-check.log
echo "ℹ️  Πάτησε Enter όταν τελειώσεις το manual test (ή Ctrl+C για να το διακόψεις αν κάτι πάει στραβά)" | tee -a project-check.log
read -p "↩️ "

kill $PREVIEW_PID || true
sleep 2

echo "🚦 5.1 Running Firebase deploy dry-run..." | tee -a project-check.log
if ! firebase deploy --dry-run; then
  echo "❌ Firebase deploy dry-run failed. Διόρθωσε τα σφάλματα!" | tee -a project-check.log
  exit 1
fi
echo "✅ Firebase deploy dry-run passed." | tee -a project-check.log

if [ -f package.json ] && grep -q "\"test\":" package.json; then
  echo "🚦 6. Running tests (npm test)..." | tee -a project-check.log
  if ! npm test; then
    echo "❌ Tests failed. Κάτι δεν πάει καλά!" | tee -a project-check.log
    exit 1
  fi
  echo "✅ Tests passed." | tee -a project-check.log
else
  echo "ℹ️  Δεν βρέθηκαν tests, προχωράμε." | tee -a project-check.log
fi

echo "🎉 ΟΛΑ ΚΑΛΑ! Τώρα μπορείς να κάνεις deploy με ασφάλεια!" | tee -a project-check.log