# OSINT Framework Clone (VM - Dev & Prod Builds)

This project includes a working **frontend (Vite+React)** and **backend (Express)** with
dev/prod build scripts and a simple rsync-based VM deploy (no Docker/K8s).

## Build locally
```bash
# Dev build
./scripts/build-dev.sh

# Prod build
./scripts/build-prod.sh
```

## Deploy to VM
```bash
./scripts/deploy.sh ubuntu@YOUR_VM_IP prod /opt/osint-framework
```

The deploy script syncs the selected build (`backend/dist/<env>/`) to the remote path
and restarts the systemd service.

## VM Setup
1) Install Node.js >= 18
2) Copy the unit and enable it:
```bash
sudo cp systemd/osint-backend.service /etc/systemd/system/osint-backend.service
sudo systemctl daemon-reload
sudo systemctl enable --now osint-backend.service
```

## Notes
- Backend reads built files from `backend/dist/<env>`; frontend build is copied into `public/` inside that folder.
- Systemd assumes files are at `/opt/osint-framework` (match the deploy path).
- Adjust `User=` and ports as needed.
