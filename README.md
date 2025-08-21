OSINT Framework Clone - VM Deployment (Dev & Prod)

This package contains a full-stack small OSINT Explorer clone prepared for VM deployments (no Docker, no Kubernetes).
The backend serves the built frontend from `backend/public/` so you only need to run one Node.js service.

Layout
```
/mnt/data/osint-framework-vm-deploy/
├── backend/           # Express backend + public static folder
├── frontend/          # React + Vite source (builds to frontend/dist)
├── scripts/           # build-dev.sh, build-prod.sh, deploy.sh
└── systemd/           # osint-backend.service unit file
```

Prerequisites (build host & VM)
- Node.js >= 18 and npm
- rsync + ssh access between build host and VM (for deploy.sh)
- On VM: systemd, and user with sudo privileges (for restarting service)
- (Optional) Nginx if you want to reverse-proxy or add TLS

Build (local or CI)

Development build (dev mode)
```
./scripts/build-dev.sh
# - builds frontend in dev mode (vite --mode dev)
# - copies built files to backend/public/
# - installs backend production deps (npm ci --production)
```

Production build (prod mode)
```
./scripts/build-prod.sh
# - builds frontend optimized for prod (vite --mode prod)
# - copies built files to backend/public/
# - installs backend production deps (npm ci --production)
```

Deploy to VM (one-liner)

Use the `deploy.sh` helper to sync the `backend/` folder to the VM and restart the systemd service.

```
./scripts/deploy.sh ubuntu@1.2.3.4 /srv/osint prod
```

This will:
- rsync `backend/` to `/srv/osint/backend/` on the remote host
- run `npm ci --production` on the remote to ensure `node_modules` are installed
- restart `osint-backend.service` on the remote (systemd)

Manual VM setup (if you prefer manual steps)

1) Create remote directories and copy files
```
ssh ubuntu@1.2.3.4 "sudo mkdir -p /srv/osint && sudo chown $USER:$USER /srv/osint"
rsync -av backend/ ubuntu@1.2.3.4:/srv/osint/backend/
```

2) Install Node.js on VM
```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
```

3) Install backend production deps on VM
```
ssh ubuntu@1.2.3.4 "cd /srv/osint/backend && npm ci --production"
```

4) Create systemd service
Copy `systemd/osint-backend.service` to `/etc/systemd/system/osint-backend.service` on the VM and edit if needed (WorkingDirectory/path/user). Then:
```
sudo systemctl daemon-reload
sudo systemctl enable --now osint-backend.service
```

5) (Optional) Use Nginx as reverse proxy and TLS
Example Nginx server block (replace your_domain):
```
server {
    listen 80;
    server_name your_domain;

    location /api/ {
        proxy_pass http://127.0.0.1:4000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        root /srv/osint/backend/public;
        try_files $uri /index.html;
    }
}
```
Use Certbot for TLS:
```
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your_domain
```

CI Integration ideas
- In Harness / Jenkins / GitHub Actions: run `./scripts/build-prod.sh`, then `./scripts/deploy.sh` to push to the VM.
- Use SSH keys for non-interactive deploys.
- Keep secrets (like server SSH user or path) in pipeline variables/secret store.

Notes & Next steps
- The backend reads config from `backend/config/dev.json` or `backend/config/prod.json` via `NODE_ENV`.
- You can extend the backend to use a proper DB (SQLite/Postgres) later.
- If you expect high traffic, put Nginx in front to serve static content and handle SSL.
