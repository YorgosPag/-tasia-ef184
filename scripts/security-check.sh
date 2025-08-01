#!/usr/bin/env bash

# Βήμα 5: Έλεγχος για ευπάθειες ασφαλείας και .gitignore

set -e

echo "🚦 Βήμα 5: Έλεγχος για ευπάθειες ασφαλείας (npm audit)..."

if npm audit --audit-level high 2>/dev/null | grep -q "found.*vulnerabilities"; then
  echo "⚠️  High severity vulnerabilities found! Run 'npm audit fix'"
else
  echo "✅ No high severity vulnerabilities found."
fi

echo "🚦 Έλεγχος .gitignore και ευαίσθητων αρχείων..."

if [ ! -f .gitignore ]; then
  echo "❌ Missing .gitignore file!"
  exit 1
fi
if grep -q ".env" .gitignore && git ls-files | grep -E "^\.env(\.|$)"; then
  echo "❌ Sensitive .env file found in git index!"
  exit 1
fi

echo "✅ .gitignore και sensitive files check passed."
