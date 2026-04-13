#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/IdemuMD/Proeveeksamen-oevelse.git}"
APP_DIR="${APP_DIR:-/opt/foxvote}"
FRONTEND_IP="${FRONTEND_IP:-10.12.2.221}"
DB_IP="${DB_IP:-10.12.2.220}"
BRANCH="${BRANCH:-vm/backend-10.12.2.222}"

install_node_22() {
  if command -v node >/dev/null 2>&1; then
    local major
    major="$(node -v | sed -E 's/v([0-9]+).*/\1/')"
    if [ "${major}" -ge 22 ]; then
      return
    fi
  fi

  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
}

echo "[backend] Installing base packages..."
sudo apt-get update
sudo apt-get install -y curl git ufw ca-certificates gnupg lsb-release
install_node_22

echo "[backend] Cloning/updating app repo..."
if [ ! -d "${APP_DIR}/.git" ]; then
  sudo mkdir -p "${APP_DIR}"
  sudo chown -R "$USER:$USER" "${APP_DIR}"
  git clone --branch "${BRANCH}" --single-branch "${REPO_URL}" "${APP_DIR}"
else
  git -C "${APP_DIR}" fetch origin "${BRANCH}"
  git -C "${APP_DIR}" checkout "${BRANCH}"
  git -C "${APP_DIR}" pull --ff-only origin "${BRANCH}"
fi

cd "${APP_DIR}"
npm --prefix backend install

if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
fi
sed -i.bak "s#^MONGO_URI=.*#MONGO_URI=mongodb://${DB_IP}:27017/foxvote#" backend/.env
sed -i.bak "s#^FRONTEND_ORIGIN=.*#FRONTEND_ORIGIN=http://${FRONTEND_IP}#" backend/.env

echo "[backend] Configuring systemd..."
sudo cp deploy/systemd/foxvote-backend.service /etc/systemd/system/foxvote-backend.service
sudo systemctl daemon-reload
sudo systemctl enable --now foxvote-backend

echo "[backend] Applying firewall rules..."
bash deploy/scripts/ufw-backend.sh "${FRONTEND_IP}"

echo "[backend] Done. API should be available on port 4000 (frontend-only)."
