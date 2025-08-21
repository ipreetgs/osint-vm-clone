#!/usr/bin/env bash
set -euo pipefail
if [ $# -lt 2 ]; then
  echo "Usage: $0 <user@host> <remote_path> [env]"
  echo "Example: $0 ubuntu@1.2.3.4 /srv/osint prod"
  exit 2
fi
TARGET=$1
REMOTE_PATH=$2
ENV=${3:-prod}

echo "Deploying ($ENV) to $TARGET:$REMOTE_PATH"

# Build locally before deploy? assume build has been run.
echo "Syncing backend (including public build) to remote..."
rsync -av --delete backend/ ${TARGET}:${REMOTE_PATH}/backend/

echo "Creating remote node_modules (installing production deps on remote)"
ssh ${TARGET} "cd ${REMOTE_PATH}/backend && npm ci --production"

echo "Restarting systemd service on remote"
ssh ${TARGET} "sudo systemctl daemon-reload || true; sudo systemctl restart osint-backend.service || true"

echo "Deploy finished."
