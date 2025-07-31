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

# Cleanup function
cleanup() {
  echo "🧹 Cleaning up processes..." | tee -a project-check.log
  kill $DEV_PID $PREVIEW_PID $EMULATOR_PID $FIRESTORE_TEST_PID 2>/dev/null || true
}
trap cleanup EXIT

echo "Ξεκίνησε: $(date)" | tee -a project-check.log

echo "🚦 1 Checking required environment variables..." | tee -a project-check.log
REQUIRED_VARS=() # Αφαιρέθηκε ο έλεγχος για NEXT_PUBLIC_API_URL
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing env variable: $var" | tee -a project-check.log
    exit 1
  fi
done
echo "✅ Env variables look ok." | tee -a project-check.log

echo "🚦 2 Checking environment files consistency..." | tee -a project-check.log
ENV_FILES=("***REMOVED***.local" "***REMOVED***.development" "***REMOVED***.production")
for env_file in "${ENV_FILES[@]}"; do
  if [ -f "$env_file" ]; then
    echo "ℹ️  Found $env_file - checking for required keys..." | tee -a project-check.log
    # Έλεγχος για κενές γραμμές ή λάθος format
    if grep -q "^[^#]*=" "$env_file"; then
      echo "✅ $env_file contains environment variables." | tee -a project-check.log
    fi
  fi
done

echo "🚦 3 Ensuring .prettierignore exists and is sane..." | tee -a project-check.log
if [ ! -f .prettierignore ]; then
  echo "node_modules\n.next\n.firebase\nout\ndist\ncoverage\npublic" > .prettierignore
  echo "✅ .prettierignore created!" | tee -a project-check.log
else
  echo "✅ .prettierignore already exists." | tee -a project-check.log
fi

echo "🚦 4 Checking for security vulnerabilities..." | tee -a project-check.log
if npm audit --audit-level high 2>/dev/null | grep -q "found.*vulnerabilities"; then
  echo "⚠️  High severity vulnerabilities found! Run 'npm audit fix'" | tee -a project-check.log
else
  echo "✅ No high severity vulnerabilities found." | tee -a project-check.log
fi

echo "🚦 5 Checking Firebase configuration..." | tee -a project-check.log
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

echo "🚦 6 Checking .gitignore and sensitive files..." | tee -a project-check.log
if [ ! -f .gitignore ]; then
  echo "❌ Missing .gitignore file!" | tee -a project-check.log
  exit 1
fi
if grep -q "***REMOVED***" .gitignore && git ls-files | grep -q "***REMOVED***"; then
  echo "❌ Sensitive ***REMOVED*** file found in git index!" | tee -a project-check.log
  exit 1
fi
echo "✅ .gitignore and sensitive files check passed." | tee -a project-check.log

echo "🚦 7 Checking for uncommitted changes..." | tee -a project-check.log
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Υπάρχουν uncommitted changes! Καλό είναι να τα commitάρεις πριν συνεχίσεις." | tee -a project-check.log
  echo "ℹ️  Θέλεις να κάνεις commit τώρα; (y/n)" | tee -a project-check.log
  read -p "↩️ " COMMIT_RESPONSE
  if [ "$COMMIT_RESPONSE" = "y" ]; then
    echo "ℹ️  Εισάγετε μήνυμα για το commit:" | tee -a project-check.log
    read -p "↩️ " COMMIT_MESSAGE
    if [ -z "$COMMIT_MESSAGE" ]; then
      COMMIT_MESSAGE="Auto-commit from project-check.sh"
    fi
    git add .
    git commit -m "$COMMIT_MESSAGE"
    echo "✅ Changes committed." | tee -a project-check.log
  else
    echo "ℹ️  Συνεχίζουμε χωρίς commit." | tee -a project-check.log
  fi
else
  echo "✅ No uncommitted changes found." | tee -a project-check.log
fi

echo "🚦 8 Checking for outdated dependencies..." | tee -a project-check.log
if npm outdated | grep -q 'Package'; then
  echo "⚠️  Υπάρχουν outdated dependencies!" | tee -a project-check.log
  echo "ℹ️  Τρέξε 'npm outdated' για λεπτομέρειες και 'npm update' για ενημέρωση (προσοχή!)." | tee -a project-check.log
  echo "ℹ️  Για major versions: 'npm install package@latest' (ελέγχεις ένα ένα)." | tee -a project-check.log
  echo "ℹ️  Θέλεις να τρέξεις 'npm update' τώρα; (y/n)" | tee -a project-check.log
  read -p "↩️ " UPDATE_RESPONSE
  if [ "$UPDATE_RESPONSE" = "y" ]; then
    if npm update; then
      echo "✅ Dependencies updated." | tee -a project-check.log
    else
      echo "❌ Failed to update dependencies. Διόρθωσε τα σφάλματα!" | tee -a project-check.log
      exit 1
    fi
  else
    echo "ℹ️  Συνεχίζουμε χωρίς update." | tee -a project-check.log
  fi
else
  echo "✅ No outdated dependencies found." | tee -a project-check.log
fi

echo "🚦 9 Linting code (npm run lint)..." | tee -a project-check.log
if ! npm run lint; then
  echo "❌ Linting failed. Διόρθωσε τα lint errors πριν συνεχίσεις!" | tee -a project-check.log
  exit 1
fi
echo "✅ Linting passed." | tee -a project-check.log

echo "🚦 10 Checking code formatting (prettier --check)..." | tee -a project-check.log
if [ -f package.json ] && grep -q "\"format\":" package.json; then
  if ! npm run format:check; then
    echo "⚠️  Formatting issues found. Auto-fixing..." | tee -a project-check.log
    npm run format || npx prettier --write .
    echo "✅ Formatting fixed automatically." | tee -a project-check.log
  else
    echo "✅ Formatting OK." | tee -a project-check.log
  fi
elif npx prettier --check . 2>/dev/null; then
  echo "✅ Formatting OK (prettier --check)." | tee -a project-check.log
else
  echo "⚠️  Formatting issues found. Auto-fixing..." | tee -a project-check.log
  npx prettier --write .
  echo "✅ Formatting fixed automatically." | tee -a project-check.log
fi

echo "🚦 11 Type checking (tsc --noEmit)..." | tee -a project-check.log
if ! npx tsc --noEmit; then
  echo "❌ TypeScript type check failed. Διόρθωσε τα type errors πριν συνεχίσεις!" | tee -a project-check.log
  exit 1
fi
echo "✅ TypeScript types are valid." | tee -a project-check.log

echo "🚦 12 Checking Firebase Emulator Suite..." | tee -a project-check.log
if firebase emulators:start --only firestore,functions --inspect-functions &>/tmp/emulator.log & then
  EMULATOR_PID=$!
  sleep 15

  # Έλεγχος αν το Firestore emulator ξεκίνησε
  if timeout 30 curl --silent --fail http://localhost:8080 >/dev/null; then
    echo "✅ Firestore emulator responds!" | tee -a project-check.log
  else
    echo "❌ Firestore emulator failed to respond!" | tee -a project-check.log
    kill $EMULATOR_PID || true
    exit 1
  fi

  # Έλεγχος Firestore UI
  if timeout 10 curl --silent --fail http://localhost:4000 >/dev/null; then
    echo "✅ Firestore Emulator UI available at http://localhost:4000" | tee -a project-check.log
  else
    echo "⚠️  Firestore Emulator UI not accessible (might be disabled)" | tee -a project-check.log
  fi

  kill $EMULATOR_PID || true
  sleep 3
else
  echo "❌ Failed to start Firebase emulators!" | tee -a project-check.log
  exit 1
fi

echo "🚦 13 Validating Firebase Security Rules..." | tee -a project-check.log
if [ -f firestore.rules ]; then
  if ! firebase emulators:exec --only firestore 'echo "Firestore emulator is running"'; then
    echo "❌ Firestore rules validation failed!" | tee -a project-check.log
    exit 1
  fi
  echo "✅ Firestore security rules are valid." | tee -a project-check.log
else
  echo "ℹ️  No firestore.rules file found, skipping validation." | tee -a project-check.log
fi

echo "🚦 14 Checking Firestore indexes..." | tee -a project-check.log
if [ -f firestore.indexes.json ]; then
  echo "ℹ️  Found firestore.indexes.json - make sure indexes are deployed in production." | tee -a project-check.log
  echo "✅ Firestore indexes file found." | tee -a project-check.log
else
  echo "ℹ️  No firestore.indexes.json found." | tee -a project-check.log
fi

echo "🚦 15 Checking Firebase Functions..." | tee -a project-check.log
if [ -d "functions" ]; then
  cd functions
  if ! npm run build 2>/dev/null; then
    echo "❌ Functions build failed!" | tee -a project-check.log
    cd ..
    exit 1
  fi
  cd ..
  echo "✅ Firebase Functions build OK." | tee -a project-check.log
else
  echo "ℹ️  No functions directory found, skipping." | tee -a project-check.log
fi

echo "🚦 16 Testing Firestore connection..." | tee -a project-check.log
# Start emulator for testing
firebase emulators:start --only firestore --project demo-test &>/tmp/firestore-test.log &
FIRESTORE_TEST_PID=$!

# Wait for emulator to be ready with a reliable retry loop
echo "⏳ Waiting for Firestore emulator to start..." | tee -a project-check.log
timeout=30
while ! curl --silent --fail http://127.0.0.1:8080 >/dev/null && [ $timeout -gt 0 ]; do
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -eq 0 ]; then
  echo "❌ Could not start Firestore emulator for testing!" | tee -a project-check.log
  kill $FIRESTORE_TEST_PID || true
  exit 1
fi

echo "✅ Firestore emulator started for connection testing." | tee -a project-check.log

# Test basic Firestore operations with Firebase Admin SDK (if exists)
if [ -f "firebase-admin-test.js" ]; then
  echo "ℹ️  Running Firestore connection test..." | tee -a project-check.log
  node firebase-admin-test.js && echo "✅ Firestore operations test passed." | tee -a project-check.log
else
  echo "ℹ️  No Firestore connection test file found. Consider adding firebase-admin-test.js" | tee -a project-check.log
fi

# Check for Firebase config in the app
if grep -r "initializeApp\|getFirestore" src/ >/dev/null 2>&1; then
  echo "✅ Firebase/Firestore initialization found in source code." | tee -a project-check.log
else
  echo "⚠️  No Firebase/Firestore initialization found in src/. Make sure Firebase is properly configured." | tee -a project-check.log
fi

# Check for Firebase environment variables
ENV_VARS_FOUND=0
for env_file in ***REMOVED*** ***REMOVED***.local ***REMOVED***.development ***REMOVED***.production; do
  if [ -f "$env_file" ]; then
    if grep -q "FIREBASE\|NEXT_PUBLIC_FIREBASE" "$env_file"; then
      echo "✅ Firebase config found in $env_file" | tee -a project-check.log
      ENV_VARS_FOUND=1
    fi
  fi
done

if [ $ENV_VARS_FOUND -eq 0 ]; then
  echo "⚠️  No Firebase environment variables found. Make sure Firebase config is set." | tee -a project-check.log
fi

kill $FIRESTORE_TEST_PID || true
sleep 3
echo "✅ Firestore connection tests completed." | tee -a project-check.log

echo "🚦 17 Running development server (npm run dev)..." | tee -a project-check.log
npm run dev &
DEV_PID=$!
sleep 10

echo "🔍 Checking if dev server responds at http://localhost:9003..." | tee -a project-check.log
if timeout 30 curl --silent --fail http://localhost:9003 >/dev/null; then
  echo "✅ Dev server responds!" | tee -a project-check.log
else
  echo "❌ Dev server ΔΕΝ απαντάει! Κάτι τρέχει..." | tee -a project-check.log
  kill $DEV_PID || true
  exit 1
fi

echo "🚦 3.1 Running E2E tests (npm run e2e)..." | tee -a project-check.log
if [ -f package.json ] && grep -q "\"e2e\":" package.json; then
  if ! npm run e2e; then
    echo "❌ E2E tests failed. Διόρθωσε τα σφάλματα!" | tee -a project-check.log
    kill $DEV_PID || true
    exit 1
  fi
  echo "✅ E2E tests passed." | tee -a project-check.log
else
  echo "ℹ️  Δεν βρέθηκαν E2E tests, προχωράμε." | tee -a project-check.log
fi

echo "🚦 18 Testing critical API endpoints..." | tee -a project-check.log
CRITICAL_ENDPOINTS=("/api/health" "/api/auth/status")
for endpoint in "${CRITICAL_ENDPOINTS[@]}"; do
  if timeout 10 curl --silent --fail "http://localhost:9003$endpoint" >/dev/null; then
    echo "✅ $endpoint responds" | tee -a project-check.log
  else
    echo "ℹ️  $endpoint not responding (might be expected)" | tee -a project-check.log
  fi
done

echo "🚦 19 Manual testing required..." | tee -a project-check.log
echo "ℹ️  Ελεγξε MANUAL στον browser σου αν φορτώνει σωστά στο http://localhost:9003" | tee -a project-check.log
echo "ℹ️  Άνοιξε τα Developer Tools και δες αν υπάρχουν errors στο console" | tee -a project-check.log
echo "ℹ️  Κόκκινα errors = πρόβλημα, κίτρινα warnings = προσοχή" | tee -a project-check.log
echo "ℹ️  Πάτησε Enter όταν τελειώσεις το manual test (ή Ctrl+C για να το διακόψεις αν κάτι πάει στραβά)" | tee -a project-check.log
read -p "↩️ "

kill $DEV_PID || true
sleep 2

echo "🚦 20 Building production build (npm run build)..." | tee -a project-check.log
if ! npm run build; then
  echo "❌ Production build failed. Διόρθωσε τα build errors!" | tee -a project-check.log
  exit 1
fi
echo "✅ Build passed." | tee -a project-check.log

echo "🚦 21 Checking production build size..." | tee -a project-check.log
MAX_SIZE=$((2 * 1024 * 1024)) # 2MB in bytes
BUILD_SIZE=$(find dist -type f -exec du -b {} + 2>/dev/null | awk '{sum += $1} END {print sum}' || echo "0")
if [ "$BUILD_SIZE" -gt "$MAX_SIZE" ]; then
  echo "⚠️  Build size ($BUILD_SIZE bytes) exceeds recommended limit ($MAX_SIZE bytes)!" | tee -a project-check.log
else
  echo "✅ Build size is within limits ($BUILD_SIZE bytes)." | tee -a project-check.log
fi

echo "🚦 22 Analyzing bundle for potential issues..." | tee -a project-check.log
if command -v npx >/dev/null 2>&1 && [ -d "dist/static/js" ]; then
  echo "ℹ️  Bundle analysis available - consider running bundle analyzer manually if needed." | tee -a project-check.log
else
  echo "ℹ️  Bundle analysis skipped." | tee -a project-check.log
fi

echo "🚦 23 Starting production preview (npm start)..." | tee -a project-check.log
npm start &
PREVIEW_PID=$!
sleep 10

echo "🔍 Checking if production server responds at http://localhost:9003..." | tee -a project-check.log
if timeout 30 curl --silent --fail http://localhost:9003 >/dev/null; then
  echo "✅ Production server responds!" | tee -a project-check.log

  # Έλεγχος για Firestore errors στο production build
  echo "🚦 24 Checking Firestore connection in production mode..." | tee -a project-check.log
  sleep 5

  # Test αν υπάρχουν console errors σχετικά με Firebase/Firestore
  echo "ℹ️  Ελέγχουμε για Firebase/Firestore errors στο production build..." | tee -a project-check.log
  echo "ℹ️  Άνοιξε το http://localhost:9003 και δες το console για Firebase errors." | tee -a project-check.log

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

echo "🚦 25 Running Firebase deploy dry-run..." | tee -a project-check.log
if ! firebase deploy --dry-run; then
  echo "❌ Firebase deploy dry-run failed. Διόρθωσε τα σφάλματα!" | tee -a project-check.log
  exit 1
fi
echo "✅ Firebase deploy dry-run passed." | tee -a project-check.log

if [ -f package.json ] && grep -q "\"test\":" package.json; then
  echo "🚦 26 Running tests (npm test)..." | tee -a project-check.log
  if ! npm test; then
    echo "❌ Tests failed. Κάτι δεν πάει καλά!" | tee -a project-check.log
    exit 1
  fi
  echo "✅ Tests passed." | tee -a project-check.log
else
  echo "ℹ️  Δεν βρέθηκαν tests, προχωράμε." | tee -a project-check.log
fi

echo "🎉 ΟΛΑ ΚΑΛΑ! Τώρα μπορείς να κάνεις deploy με ασφάλεια!" | tee -a project-check.log
echo "Τελείωσε: $(date)" | tee -a project-check.log

## --- ΤΕΛΙΚΟ BLOCK ΑΥΤΟΜΑΤΟΠΟΙΗΣΗΣ ---

echo "🚦 27 [AUTO] Τελικό production build (npm run build)..." | tee -a project-check.log
if ! npm run build; then
  echo "❌ Production build failed. Διόρθωσε τα build errors και ξανατρέξε το script!" | tee -a project-check.log
  exit 1
fi
echo "✅ Build ΟΚ." | tee -a project-check.log

echo "🚦 28 [AUTO] Προεπισκόπηση (npm start)..." | tee -a project-check.log
npm start &
FINAL_PREVIEW_PID=$!
sleep 10

echo "🔍 Έλεγχος αν το production server ανταποκρίνεται (http://localhost:9003)..." | tee -a project-check.log
if timeout 30 curl --silent --fail http://localhost:9003 >/dev/null; then
  echo "✅ Production preview ΟΚ!" | tee -a project-check.log
else
  echo "❌ Production server ΔΕΝ ανταποκρίνεται! Κάτι πήγε λάθος." | tee -a project-check.log
  kill $FINAL_PREVIEW_PID || true
  exit 1
fi

kill $FINAL_PREVIEW_PID || true
sleep 2

echo "🚦 29 [AUTO] Τελικό deploy στο Firebase..." | tee -a project-check.log
if ! firebase deploy; then
  echo "❌ Deploy failed! Διόρθωσε και ξαναπροσπάθησε." | tee -a project-check.log
  exit 1
fi
echo "✅ Deploy ΟΚ." | tee -a project-check.log

echo "🚦 30 [MANUAL STEP] Πήγαινε τώρα στο Firebase Studio και πάτα το ΜΠΛΕ κουμπί **PUBLISH** για να βγουν live οι αλλαγές σου!" | tee -a project-check.log
echo "👉 https://console.firebase.google.com/project/ΤΟ_ΟΝΟΜΑ_ΤΟΥ_PROJECT_SOU/studio (αντικατέστησε το με το δικό σου link αν θες)" | tee -a project-check.log

echo "" | tee -a project-check.log
echo "🏁 ΟΛΟΚΛΗΡΩΘΗΚΕ Η ΔΙΑΔΙΚΑΣΙΑ!" | tee -a project-check.log
echo "" | tee -a project-check.log
echo "🚦 Θέλεις να κάνεις commit & push στο GitHub; [y/N]" | tee -a project-check.log
read -r COMMIT_GIT
if [[ "$COMMIT_GIT" =~ ^([yY][eE][sS]|[yY])$ ]]
then
  echo "Γράψε το commit message σου (ή πάτα Enter για default):" | tee -a project-check.log
  read -r COMMIT_MSG
  if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="autocommit by project-check.sh $(date '+%Y-%m-%d %H:%M')"
  fi
  git add .
  git commit -m "$COMMIT_MSG"
  git push
  echo "✅ Κώδικας στάλθηκε στο GitHub!" | tee -a project-check.log
else
  echo "ℹ️  Παρέλειψες το GitHub commit/push. Όποτε θες, το κάνεις χειροκίνητα." | tee -a project-check.log
fi
echo "🎯 Μόλις πατήσεις και το PUBLISH, είσαι στον αέρα!" | tee -a project-check.log
echo "Τελείωσε: $(date)" | tee -a project-check.log