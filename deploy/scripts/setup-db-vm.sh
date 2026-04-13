#!/usr/bin/env bash
set -euo pipefail

DB_IP="${DB_IP:-10.12.2.220}"
BACKEND_IP="${BACKEND_IP:-10.12.2.222}"

install_mongodb() {
  if dpkg -s mongodb-org >/dev/null 2>&1; then
    return
  fi

  local codename
  codename="$(lsb_release -cs)"

  curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc \
    | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg

  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${codename}/mongodb-org/8.0 multiverse" \
    | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list >/dev/null

  sudo apt-get update
  sudo apt-get install -y mongodb-org
}

echo "[db] Installing base packages..."
sudo apt-get update
sudo apt-get install -y curl gnupg lsb-release ufw
install_mongodb

echo "[db] Writing mongod.conf..."
sudo tee /etc/mongod.conf >/dev/null <<EOF
storage:
  dbPath: /var/lib/mongodb
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
net:
  port: 27017
  bindIp: 127.0.0.1,${DB_IP}
processManagement:
  timeZoneInfo: /usr/share/zoneinfo
EOF

echo "[db] Starting MongoDB..."
sudo systemctl daemon-reload
sudo systemctl enable --now mongod
sudo systemctl restart mongod

echo "[db] Applying firewall rules..."
bash "$(dirname "$0")/ufw-db.sh" "${BACKEND_IP}"

echo "[db] Done. MongoDB listens on ${DB_IP}:27017 (backend-only)."
