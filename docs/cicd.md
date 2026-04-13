# CI/CD med GitHub Actions

Workflow-fil: `.github/workflows/ci-cd.yml`

## CI (push + pull request)
Kjører automatisk:
1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

## CD (kun `main`)
Ved push til `main` deployes til frontend- og backend-VM via SSH.

Nødvendige GitHub Secrets:
- `FRONTEND_SSH_HOST`
- `FRONTEND_SSH_USER`
- `FRONTEND_SSH_KEY`
- `BACKEND_SSH_HOST`
- `BACKEND_SSH_USER`
- `BACKEND_SSH_KEY`

Deploy-script på VM:
1. `git pull origin main`
2. `npm ci`
3. `npm run build`
4. `sudo systemctl restart foxvote-frontend` eller `foxvote-backend`
