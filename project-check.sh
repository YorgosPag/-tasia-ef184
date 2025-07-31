#!/bin/bash

echo "🚦 1. Linting code (npm run lint)..."
npm run lint
LINT_RESULT=$?
if [ $LINT_RESULT -ne 0 ]; then
  echo "❌ Linting failed. Διόρθωσε τα lint errors πριν συνεχίσεις!"
  exit 1
fi
echo "✅ Linting passed."

echo "🚦 2. Type checking (tsc --noEmit)..."
npx tsc --noEmit
TYPE_RESULT=$?
if [ $TYPE_RESULT -ne 0 ]; then
  echo "❌ TypeScript type check failed. Διόρθωσε τα type errors πριν συνεχίσεις!"
  exit 1
fi
echo "✅ TypeScript types are valid."

echo "🚦 3. Running development server (npm run dev)..."
npm run dev &
DEV_PID=$!
sleep 10

echo "ℹ️  Ελεγξε MANUAL στον browser σου αν φορτώνει σωστά στο http://localhost:3000"
echo "ℹ️  Πάτησε Enter όταν τελειώσεις το manual test (ή Ctrl+C για να το διακόψεις αν κάτι πάει στραβά)"
read -p "↩️ "

kill $DEV_PID
sleep 2

echo "🚦 4. Building production build (npm run build)..."
npm run build
BUILD_RESULT=$?
if [ $BUILD_RESULT -ne 0 ]; then
  echo "❌ Production build failed. Διόρθωσε τα build errors!"
  exit 1
fi
echo "✅ Build passed."

echo "🚦 5. Starting production preview (npm start)..."
npm start &
PREVIEW_PID=$!
sleep 10

echo "ℹ️  Ελεγξε MANUAL στον browser σου αν φορτώνει σωστά στο http://localhost:3000 (production mode)"
echo "ℹ️  Πάτησε Enter όταν τελειώσεις το manual test (ή Ctrl+C για να το διακόψεις αν κάτι πάει στραβά)"
read -p "↩️ "

kill $PREVIEW_PID
sleep 2

# OPTIONAL: Αν έχεις tests
if [ -f package.json ] && grep -q "\"test\":" package.json; then
  echo "🚦 6. Running tests (npm test)..."
  npm test
  TEST_RESULT=$?
  if [ $TEST_RESULT -ne 0 ]; then
    echo "❌ Tests failed. Κάτι δεν πάει καλά!"
    exit 1
  fi
  echo "✅ Tests passed."
else
  echo "ℹ️  Δεν βρέθηκαν tests, προχωράμε."
fi

echo "🎉 ΟΛΑ ΚΑΛΑ! Τώρα μπορείς να κάνεις deploy με ασφάλεια!"
