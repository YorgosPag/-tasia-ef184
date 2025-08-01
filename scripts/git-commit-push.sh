#!/usr/bin/env bash

# Βήμα 23: Commit & push στο GitHub (προαιρετικό)

set -e

echo "🚦 Θέλεις να κάνεις commit & push στο GitHub; [y/N]"
read -r COMMIT_GIT

if [[ "$COMMIT_GIT" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo "Γράψε το commit message σου (ή πάτα Enter για default):"
  read -r COMMIT_MSG
  if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="autocommit by project-check.sh $(date '+%Y-%m-%d %H:%M')"
  fi
  git add .
  git commit -m "$COMMIT_MSG"
  git push
  echo "✅ Κώδικας στάλθηκε στο GitHub!"
else
  echo "ℹ️  Παρέλειψες το GitHub commit/push. Όποτε θες, το κάνεις χειροκίνητα."
fi

echo "🎯 Μόλις πατήσεις και το PUBLISH, είσαι στον αέρα!"
