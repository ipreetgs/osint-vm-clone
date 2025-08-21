#!/usr/bin/env bash
set -euo pipefail
echo "Building backend (prod)..."
cd backend
npm ci --production
npx babel src --out-dir dist/prod --copy-files --extensions ".js"
echo "Building frontend (prod)..."
cd ../frontend
npm ci --production
npm run build:prod
echo "Copying frontend build into backend dist/prod/public..."
rm -rf ../backend/dist/prod/public || true
mkdir -p ../backend/dist/prod/public
cp -r dist/* ../backend/dist/prod/public/
echo "Prod build complete."
