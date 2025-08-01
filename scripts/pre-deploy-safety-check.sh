#!/usr/bin/env bash

# Βήμα 24: Τελικός έλεγχος ευαίσθητων αρχείων και καθαρού git πριν deploy & push

set -e

echo "🚦 Βήμα 24: Έλεγχος για ευαίσθητα αρχεία στο staged area και καθαρό git status..."

# Έλεγχος αν υπάρχουν αρχεία .env ή άλλα ευαίσθητα στον staged area (git index)
SENSITIVE_FILES=$(git diff --cached --name-only | grep -E '\.env|secrets|credentials' || true)
if [ -n "$SENSITIVE_FILES" ]; then
  echo "❌ Ευαίσθητα αρχεία στο git index (staged area):"
  echo "$SENSITIVE_FILES"
  echo "Παρακαλώ αφαίρεσέ τα με 'git reset' πριν συνεχίσεις."
  exit 1
fi

# Έλεγχος αν το git working directory είναι καθαρό (χωρίς uncommitted αλλαγές)
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Το git working directory δεν είναι καθαρό. Κάνε commit ή stash πριν προχωρήσεις."
  exit 1
fi

echo "✅ Git καθαρό και χωρίς ευαίσθητα αρχεία staged."

# Προαιρετικά: επιβεβαίωση από χρήστη πριν deploy
read -p "Είσαι σίγουρος ότι θες να προχωρήσεις στο deploy; [y/N] " CONFIRM
if [[ ! "$CONFIRM" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo "🚫 Deploy ακυρώθηκε από χρήστη."
  exit 1
fi

echo "🚦 Προχωράμε με το deploy..."
