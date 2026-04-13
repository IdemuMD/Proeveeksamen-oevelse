#!/usr/bin/env bash
set -euo pipefail

FRONTEND_IP="${1:-10.12.2.221}"

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow from "${FRONTEND_IP}" to any port 4000 proto tcp
sudo ufw --force enable
sudo ufw status verbose
