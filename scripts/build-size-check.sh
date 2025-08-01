#!/usr/bin/env bash

# Βήμα 16: Έλεγχος μεγέθους production build

set -e

echo "🚦 Βήμα 16: Έλεγχος μεγέθους production build..."

MAX_SIZE=$((2 * 1024 * 1024)) # 2MB σε bytes
BUILD_SIZE=$(find dist -type f -exec du -b {} + 2>/dev/null | awk '{sum += $1} END {print sum}' || echo "0")

if [ "$BUILD_SIZE" -gt "$MAX_SIZE" ]; then
  echo "⚠️  Build size ($BUILD_SIZE bytes) exceeds recommended limit ($MAX_SIZE bytes)!"
else
  echo "✅ Build size is within limits ($BUILD_SIZE bytes)."
fi
