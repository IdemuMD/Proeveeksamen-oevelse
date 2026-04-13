# FoxVote Backend VM Branch

This branch contains only files required to run the backend VM (`10.12.2.222`).

## Includes
- Backend API app (Express + MongoDB): `backend/`
- Backend systemd service: `deploy/systemd/foxvote-backend.service`
- Backend firewall + setup scripts:
  - `deploy/scripts/ufw-backend.sh`
  - `deploy/scripts/setup-backend-vm.sh`

## Quick setup on backend VM
```bash
git clone --branch vm/backend-10.12.2.222 --single-branch https://github.com/IdemuMD/Proeveeksamen-oevelse.git /opt/foxvote
cd /opt/foxvote
bash deploy/scripts/setup-backend-vm.sh
```
