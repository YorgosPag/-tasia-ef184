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

echo "Ξεκίνησε: $(date)"

echo "🚦 0.0 Checking required environment variables..."
REQUIRED_VARS=() # Αφαιρέθηκε ο έλεγχος για NEXT_PUBLIC_API_URL
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing env variable: $var"
    exit 1
  fi
done
echo "✅ Env variables look ok."

echo "🚦 0. Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Υπάρχουν uncommitted changes! Καλό είναι να τα commitάρεις πριν συνεχίσεις."
fi

echo "🚦 0.1 Checking for outdated dependencies..."
if npm outdated | grep -q 'Package'; then
  echo "⚠️  Υπάρχουν outdated dependencies! (Προαιρετικό) Δες τα παραπάνω και σκέψου αν πρέπει να τα ενημερώσεις."
else
  echo "✅ No outdated dependencies found."
fi

echo "🚦 1. Linting code (npm run lint)..."
if ! npm run lint; then
  echo "❌ Linting failed. Διόρθωσε τα lint errors πριν συνεχίσεις!"
  exit 1
fi
echo "✅ Linting passed."

echo "🚦 1.1 Checking code formatting (prettier --check)..."
if [ -f package.json ] && grep -q "\"format\":" package.json; then
  if ! npm run format:check; then
    echo "❌ Formatting failed. Τρέξε 'npm run format' για να διορθώσεις."
    exit 1
  fi
  echo "✅ Formatting OK."
elif npx prettier --check .; then
  echo "✅ Formatting OK (prettier --check)."
else
  echo "❌ Formatting failed. Τρέξε 'npx prettier --write .' για να διορθώσεις."
  exit 1
fi

echo "🚦 2. Type checking (tsc --noEmit)..."
if ! npx tsc --noEmit; then
  echo "❌ TypeScript type check failed. Διόρθωσε τα type errors πριν συνεχίσεις!"
  exit 1
fi
echo "✅ TypeScript types are valid."

echo "🚦 3. Running development server (npm run dev)..."
npm run dev &
DEV_PID=$!
sleep 10

echo "🔍 Checking if dev server responds at http://localhost:9003..."
if curl --silent --fail http://localhost:9003 >/dev/null; then
  echo "✅ Dev server responds!"
else
  echo "❌ Dev server ΔΕΝ απαντάει! Κάτι τρέχει..."
  kill $DEV_PID || true
  exit 1
fi

echo "ℹ️  Ελεγξε MANUAL στον browser σου αν φορτώνει σωστά στο http://localhost:9003"
echo "ℹ️  Πάτησε Enter όταν τελειώσεις το manual test (ή Ctrl+C για να το διακόψεις αν κάτι πάει στραβά)"
read -p "↩️ "

kill $DEV_PID || true
sleep 2

echo "🚦 4. Building production build (npm run build)..."
if ! npm run build; then
  echo "❌ Production build failed. Διόρθωσε τα build errors!"
  exit 1
fi
echo "✅ Build passed."

echo "🚦 5. Starting production preview (npm start)..."
npm start &
PREVIEW_PID=$!
sleep 10

echo "🔍 Checking if production server responds at http://localhost:9003..."
if curl --silent --fail http://localhost:9003 >/dev/null; then
  echo "✅ Production server responds!"
else
  echo "❌ Production server ΔΕΝ απαντάει! Κάτι τρέχει..."
  kill $PREVIEW_PID || true
  exit 1
fi

echo "ℹ️  Ελεγξε MANUAL στον browser σου αν φορτώνει σωστά στο http://localhost:9003 (production mode)"
echo "ℹ️  Πάτησε Enter όταν τελειώσεις το manual test (ή Ctrl+C για να το διακόψεις αν κάτι πάει στραβά)"
read -p "↩️ "

kill $PREVIEW_PID || true
sleep 2

if [ -f package.json ] && grep -q "\"test\":" package.json; then
  echo "🚦 6. Running tests (npm test)..."
  if ! npm test; then
    echo "❌ Tests failed. Κάτι δεν πάει καλά!"
    exit 1
  fi
  echo "✅ Tests passed."
else
  echo "ℹ️  Δεν βρέθηκαν tests, προχωράμε."
fi

echo "🎉 ΟΛΑ ΚΑΛΑ! Τώρα μπορείς να κάνεις deploy με ασφάλεια!"
