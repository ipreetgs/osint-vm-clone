#!/usr/bin/env bash
set -euo pipefail
echo "Building frontend (dev mode)..."
(cd frontend && npm ci && npm run build:dev)
echo "Copying build to backend/public..."
rm -rf backend/public
mkdir -p backend/public
cp -r frontend/dist/* backend/public/
echo "Installing backend production deps..."
(cd backend && npm ci --production)
echo "Dev build complete."
