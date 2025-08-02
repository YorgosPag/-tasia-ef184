#!/usr/bin/env bash

# Αυτόματο git pull για ενημέρωση τοπικού repo

set -e

echo "🚦 Local auto-pull: Ενημέρωση από origin main..."

git pull origin main

echo "✅ Local repo ενημερώθηκε."
