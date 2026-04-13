#!/usr/bin/env bash
set -euo pipefail

BACKEND_IP="${1:-10.12.2.222}"

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow from "${BACKEND_IP}" to any port 27017 proto tcp
sudo ufw --force enable
sudo ufw status verbose
