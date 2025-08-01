#!/usr/bin/env bash

# Βήμα 1 από 40: Έλεγχος απαραίτητων μεταβλητών περιβάλλοντος (env vars)
set -e

echo "🚦 Βήμα 1 από 40: Έλεγχος απαραίτητων env variables..."

REQUIRED_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing env variable: $var"
    exit 1
  fi
done

echo "✅ Όλα τα απαραίτητα env variables υπάρχουν."
