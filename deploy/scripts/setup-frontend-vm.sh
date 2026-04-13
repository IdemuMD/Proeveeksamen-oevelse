#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/IdemuMD/Proeveeksamen-oevelse.git}"
APP_DIR="${APP_DIR:-/opt/foxvote}"
BACKEND_IP="${BACKEND_IP:-10.12.2.222}"
BRANCH="${BRANCH:-vm/frontend-10.12.2.221}"

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

echo "[frontend] Installing base packages..."
sudo apt-get update
sudo apt-get install -y curl git nginx ufw ca-certificates gnupg lsb-release
install_node_22

echo "[frontend] Cloning/updating app repo..."
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
npm --prefix frontend install

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
fi
sed -i.bak "s#^BACKEND_BASE_URL=.*#BACKEND_BASE_URL=http://${BACKEND_IP}:4000#" frontend/.env

echo "[frontend] Configuring systemd + nginx..."
sudo cp deploy/systemd/foxvote-frontend.service /etc/systemd/system/foxvote-frontend.service
sudo systemctl daemon-reload
sudo systemctl enable --now foxvote-frontend

sudo cp deploy/nginx/frontend.conf /etc/nginx/sites-available/foxvote
sudo ln -sfn /etc/nginx/sites-available/foxvote /etc/nginx/sites-enabled/foxvote
if [ -L /etc/nginx/sites-enabled/default ]; then
  sudo rm -f /etc/nginx/sites-enabled/default
fi
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl restart nginx

echo "[frontend] Applying firewall rules..."
bash deploy/scripts/ufw-frontend.sh

echo "[frontend] Done. Frontend should be reachable on port 80."
