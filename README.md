# FoxVote MongoDB VM Branch

This branch contains only files required to run the MongoDB VM (`10.12.2.220`).

## Includes
- MongoDB sample config: `deploy/mongod.conf.sample`
- DB firewall script: `deploy/scripts/ufw-db.sh`
- DB setup script: `deploy/scripts/setup-db-vm.sh`

## Quick setup on DB VM
```bash
git clone --branch vm/db-10.12.2.220 --single-branch https://github.com/IdemuMD/Proeveeksamen-oevelse.git /opt/foxvote
cd /opt/foxvote
bash deploy/scripts/setup-db-vm.sh
```
