# FoxVote Frontend VM Branch

This branch contains only files required to run the frontend VM (`10.12.2.221`).

## Includes
- Frontend app (Express + EJS): `frontend/`
- Nginx config: `deploy/nginx/frontend.conf`
- Frontend systemd service: `deploy/systemd/foxvote-frontend.service`
- Frontend firewall + setup scripts:
  - `deploy/scripts/ufw-frontend.sh`
  - `deploy/scripts/setup-frontend-vm.sh`

## Quick setup on frontend VM
```bash
git clone --branch vm/frontend-10.12.2.221 --single-branch https://github.com/IdemuMD/Proeveeksamen-oevelse.git /opt/foxvote
cd /opt/foxvote
bash deploy/scripts/setup-frontend-vm.sh
```
