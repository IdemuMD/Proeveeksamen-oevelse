# FoxVote

FoxVote er en 3-lags webapplikasjon der brukeren velger den søteste reven mellom to tilfeldige bilder.
Systemet lagrer stemmer i MongoDB og viser live statistikk over mest populære rever.

## Stack
- Frontend: Node.js + Express + EJS
- Backend: Node.js + Express + MongoDB (Mongoose)
- Database: MongoDB
- CI/CD: GitHub Actions

## Lokal kjøring (utvikling)

### 1. Installer avhengigheter
```bash
npm install
```

### 2. Lag miljøfiler
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Oppdater `backend/.env` og `frontend/.env` ved behov.

### 3. Start tjenester
```bash
npm run start
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- Swagger: `http://localhost:4000/api/docs`

## VM-oppsett (eksamen/testmiljø)
Standard IP-plan i denne leveransen:
- DB VM: `10.12.2.220`
- Frontend VM: `10.12.2.221`
- Backend VM: `10.12.2.222`

Hurtigoppsett scripts:
- `deploy/scripts/setup-frontend-vm.sh`
- `deploy/scripts/setup-backend-vm.sh`
- `deploy/scripts/setup-db-vm.sh`

## Tester, lint og build
```bash
npm run lint
npm run test
npm run build
```

## Prosjektdokumentasjon
- [Arkitektur og IP-plan](docs/architecture.md)
- [API-endepunkter](docs/api-endpoints.md)
- [Driftsoppsett](docs/operations.md)
- [CI/CD](docs/cicd.md)
- [Sikkerhet](docs/security.md)
- [Brukerveiledning](docs/user-guide.md)
- [Demo-checkliste](docs/demo-checklist.md)

## Struktur
```
.
├── backend/
├── frontend/
├── deploy/
├── docs/
└── .github/workflows/
```
