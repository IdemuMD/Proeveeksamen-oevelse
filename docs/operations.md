# Driftsdokumentasjon (3 VM-er)

## 1. Forutsetninger
- 3 Ubuntu-servere i VirtualBox:
  - Frontend: `10.12.2.221`
  - Backend: `10.12.2.222`
  - DB: `10.12.2.220`
- Git og Node.js 22 installert på frontend/backend.
- MongoDB installert på DB-VM.

## Hurtigoppsett med scripts
Kjør følgende script på riktig VM etter at repoet er klonet:

- Frontend-VM:
  - `bash deploy/scripts/setup-frontend-vm.sh`
- Backend-VM:
  - `bash deploy/scripts/setup-backend-vm.sh`
- DB-VM:
  - `bash deploy/scripts/setup-db-vm.sh`

## 2. MongoDB (DB-VM)
1. Kopier `deploy/mongod.conf.sample` til `/etc/mongod.conf`.
2. Bekreft `bindIp: 127.0.0.1,10.12.2.220`.
3. Restart MongoDB:
   - `sudo systemctl restart mongod`
   - `sudo systemctl enable mongod`

## 3. Brannmur (UFW)
- Frontend-VM:
  - `bash deploy/scripts/ufw-frontend.sh`
- Backend-VM:
  - `bash deploy/scripts/ufw-backend.sh 10.12.2.221`
- DB-VM:
  - `bash deploy/scripts/ufw-db.sh 10.12.2.222`

Kontroller med:
- `sudo ufw status verbose`

## 4. Tjenester med systemd
1. Kopier service-filer:
   - `deploy/systemd/foxvote-frontend.service` -> `/etc/systemd/system/`
   - `deploy/systemd/foxvote-backend.service` -> `/etc/systemd/system/`
2. På frontend/backend:
   - `sudo systemctl daemon-reload`
   - `sudo systemctl enable foxvote-frontend` eller `foxvote-backend`
   - `sudo systemctl start foxvote-frontend` eller `foxvote-backend`

## 5. Nginx på frontend-VM
1. Kopier `deploy/nginx/frontend.conf` til `/etc/nginx/sites-available/foxvote`.
2. Aktiver:
   - `sudo ln -s /etc/nginx/sites-available/foxvote /etc/nginx/sites-enabled/foxvote`
   - `sudo nginx -t`
   - `sudo systemctl restart nginx`
3. HTTPS i test:
   - bruk selvsignert sertifikat.
4. HTTPS i produksjon:
   - bruk Let’s Encrypt + gyldig DNS.

## 6. Miljøfiler
- Backend: `backend/.env` (se `backend/.env.example`)
- Frontend: `frontend/.env` (se `frontend/.env.example`)

## 7. Driftstester
- Fra frontend-VM: API på backend skal svare.
- Fra ekstern klient: DB-port `27017` skal være blokkert.
- Fra frontend-VM: direkte DB-tilgang skal feile.
- Reboot VM-er og verifiser at tjenester starter automatisk.
