#!/usr/bin/env bash

# Πώς να τρέξεις το script:
#   bash project-check.sh
#
# (Αν βγάλει Permission Denied, πρώτα τρέξε:
#   chmod +x project-check.sh
# και μετά:
#   ./project-check.sh
# )
#
# Αυτό είναι το κύριο script ελέγχων (project check),
# που καλεί όλα τα βήματα μέσα στο φάκελο ./scripts

set -e

SCRIPTS_DIR="./scripts"

run_step() {
  local step_script="$SCRIPTS_DIR/$1"
  echo
  echo "====== Εκτέλεση $step_script ======"
  bash "$step_script"
}

run_step "check-env.sh"
run_step "lint.sh"
run_step "typecheck.sh"
run_step "security-check.sh"
run_step "firebase-config-check.sh"

run_step "emulator-ui-port-finder.sh"   # Νέο βήμα 9, για ρύθμιση UI πόρτας

run_step "emulator-check.sh"            # Βήμα 7 ή 8, ξεκινάει emulator με σωστές πόρτες

run_step "firestore-rules-indexes.sh"
run_step "functions-build.sh"
run_step "firestore-connection-test.sh"
run_step "dev-server.sh"
run_step "e2e-tests.sh"
run_step "critical-endpoints.sh"
run_step "manual-test.sh"
run_step "build-production.sh"
run_step "build-size-check.sh"
run_step "bundle-analyze.sh"
run_step "prod-preview.sh"
run_step "deploy-dry-run.sh"
run_step "pre-deploy-safety-check.sh"
run_step "test.sh"
run_step "final-build-deploy.sh"
run_step "manual-publish.sh"
run_step "git-commit-push.sh"

# Προαιρετικό: Επαναφορά firebase.json μετά από δοκιμές (αν χρειάζεται)
if [ -f ./scripts/emulator-ui-port-finder.sh ]; then
  echo
  echo "====== Επαναφορά firebase.json από backup (αν υπάρχει) ======"
  if [ -f firebase.json.ui.bak ]; then
    mv firebase.json.ui.bak firebase.json
    echo "✅ Επαναφορά ολοκληρώθηκε."
  fi
fi

echo
echo "🎉 ΟΛΑ ΤΑ ΒΗΜΑΤΑ ΟΛΟΚΛΗΡΩΘΗΚΑΝ ΕΠΙΤΥΧΩΣ!"
