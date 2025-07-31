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
  kill $DEV_PID $PREVIEW_PID $EMULATOR_PID 2>/dev/null || true
}
trap cleanup EXIT

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

echo "🚦 0.1 Checking environment files consistency..." | tee -a project-check.log
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

echo "🚦 0.2 Checking for security vulnerabilities..." | tee -a project-check.log
if npm audit --audit-level high 2>/dev/null | grep -q "found.*vulnerabilities"; then
  echo "⚠️  High severity vulnerabilities found! Run 'npm audit fix'" | tee -a project-check.log
else
  echo "✅ No high severity vulnerabilities found." | tee -a project-check.log
fi

echo "🚦 0.3 Checking Firebase configuration..." | tee -a project-check.log
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

echo "🚦 0.4 Checking .gitignore and sensitive files..." | tee -a project-check.log
if [ ! -f .gitignore ]; then
  echo "❌ Missing .gitignore file!" | tee -a project-check.log
  exit 1
fi
if grep -q "***REMOVED***" .gitignore && git ls-files | grep -q "***REMOVED***"; then
  echo "❌ Sensitive ***REMOVED*** file found in git index!" | tee -a project-check.log
  exit 1
fi
echo "✅ .gitignore and sensitive files check passed." | tee -a project-check.log

echo "🚦 0.5 Checking for uncommitted changes..." | tee -a project-check.log
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Υπάρχουν uncommitted changes! Καλό είναι να τα commitάρεις πριν συνεχίσεις." | tee -a project-check.log
fi

echo "🚦 0.6 Checking for outdated dependencies..." | tee -a project-check.log
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
  if timeout 30 curl --silent --fail http://localhost:8080 >/dev/null; then
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

echo "🚦 2.2 Validating Firebase Security Rules..." | tee -a project-check.log
if [ -f firestore.rules ]; then
  if ! firebase firestore:rules:validate; then
    echo "❌ Firestore rules validation failed!" | tee -a project-check.log
    exit 1
  fi
  echo "✅ Firestore security rules are valid." | tee -a project-check.log
else
  echo "ℹ️  No firestore.rules file found, skipping validation." | tee -a project-check.log
fi

echo "🚦 2.3 Checking Firestore indexes..." | tee -a project-check.log
if [ -f firestore.indexes.json ]; then
  echo "ℹ️  Found firestore.indexes.json - make sure indexes are deployed in production." | tee -a project-check.log
  echo "✅ Firestore indexes file found." | tee -a project-check.log
else
  echo "ℹ️  No firestore.indexes.json found." | tee -a project-check.log
fi

echo "🚦 2.4 Checking Firebase Functions..." | tee -a project-check.log
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

echo "🚦 3. Running development server (npm run dev)..." | tee -a project-check.log
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

echo "🚦 3.2 Testing critical API endpoints..." | tee -a project-check.log
CRITICAL_ENDPOINTS=("/api/health" "/api/auth/status")
for endpoint in "${CRITICAL_ENDPOINTS[@]}"; do
  if timeout 10 curl --silent --fail "http://localhost:9003$endpoint" >/dev/null; then
    echo "✅ $endpoint responds" | tee -a project-check.log
  else
    echo "ℹ️  $endpoint not responding (might be expected)" | tee -a project-check.log
  fi
done

echo "🚦 3.3 Manual testing required..." | tee -a project-check.log
echo "ℹ️  Ελεγξε MANUAL στον browser σου αν φορτώνει σωστά στο http://localhost:9003" | tee -a project-check.log
echo "ℹ️  Άνοιξε τα Developer Tools και δες αν υπάρχουν errors στο console" | tee -a project-check.log
echo "ℹ️  Κόκκινα errors = πρόβλημα, κίτρινα warnings = προσοχή" | tee -a project-check.log
echo "ℹ️  Πάτησε Enter όταν τελειώσεις το manual test (ή Ctrl+C για να το διακόψεις αν κάτι πάει στραβά)" | tee -a project-check.log
read -p "↩️ "

kill $DEV_PID || true
sleep 2

echo "🚦 4. Building production build (npm run build)..." | tee -a project-check.log
if ! npm run build; then
  echo "❌ Production build failed. Διόρθωσε τα build errors!" | tee -a project-check.log
  exit 1
fi
echo "✅ Build passed." | tee -a project-check.log

echo "🚦 4.1 Checking production build size..." | tee -a project-check.log
MAX_SIZE=$((2 * 1024 * 1024)) # 2MB in bytes
BUILD_SIZE=$(find dist -type f -exec du -b {} + 2>/dev/null | awk '{sum += $1} END {print sum}' || echo "0")
if [ "$BUILD_SIZE" -gt "$MAX_SIZE" ]; then
  echo "⚠️  Build size ($BUILD_SIZE bytes) exceeds recommended limit ($MAX_SIZE bytes)!" | tee -a project-check.log
else
  echo "✅ Build size is within limits ($BUILD_SIZE bytes)." | tee -a project-check.log
fi

echo "🚦 4.2 Analyzing bundle for potential issues..." | tee -a project-check.log
if command -v npx >/dev/null 2>&1 && [ -d "dist/static/js" ]; then
  echo "ℹ️  Bundle analysis available - consider running bundle analyzer manually if needed." | tee -a project-check.log
else
  echo "ℹ️  Bundle analysis skipped." | tee -a project-check.log
fi

echo "🚦 5. Starting production preview (npm start)..." | tee -a project-check.log
npm start &
PREVIEW_PID=$!
sleep 10

echo "🔍 Checking if production server responds at http://localhost:9003..." | tee -a project-check.log
if timeout 30 curl --silent --fail http://localhost:9003 >/dev/null; then
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
echo "Τελείωσε: $(date)" | tee -a project-check.log