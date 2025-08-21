#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <user@host> <dev|prod> [remote_path]"
  exit 1
fi
TARGET=$1
ENV=$2
REMOTE=${3:-/opt/osint-framework}

echo "Deploying $ENV to $TARGET:$REMOTE"
rsync -avz backend/dist/$ENV/ ${TARGET}:${REMOTE}/
ssh ${TARGET} "sudo systemctl daemon-reload || true; sudo systemctl restart osint-backend.service || true"
echo "Deploy finished."
