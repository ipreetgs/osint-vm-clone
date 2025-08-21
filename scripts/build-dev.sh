#!/usr/bin/env bash
set -euo pipefail
echo "Building backend (dev)..."
cd backend
npm ci
npx babel src --out-dir dist/dev --copy-files --extensions ".js"
echo "Building frontend (dev)..."
cd ../frontend
npm ci
npm run build:dev
echo "Copying frontend build into backend dist/dev/public..."
rm -rf ../backend/dist/dev/public || true
mkdir -p ../backend/dist/dev/public
cp -r dist/* ../backend/dist/dev/public/
echo "Dev build complete."
