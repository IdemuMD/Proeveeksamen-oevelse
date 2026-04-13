# Sikkerhetsvurdering

## Potensielle sikkerhetshull
1. Ingen rate-limiting på stemme-endepunkt kan gi stemmemanipulering.
2. For åpen CORS eller manglende inputvalidering kan gi misbruk og injeksjonsrisiko.
3. Uten HTTPS kan trafikk avlyttes eller manipuleres.

## Angrepstyper som kan ramme systemet
1. DDoS/volumangrep mot API (`/api/votes`, `/api/foxes/pair`).
2. NoSQL-injeksjon eller skadelig input i request body.
3. Skanning av åpne porter med forsøk på direkte DB-tilgang.

## Risikoreduserende tiltak
1. Rate-limiting på `POST /api/votes` (30 req/min per IP).
2. Streng validering av `foxId` og `imageUrl`.
3. CORS begrenset til frontend-origin.
4. UFW-regler som begrenser:
   - backend-port til frontend-VM
   - db-port til backend-VM
5. MongoDB bundet til intern IP + localhost.
6. TLS/HTTPS på frontend for å beskytte trafikk i transitt.
7. Sikker standard med `helmet` og begrenset JSON payload-størrelse.
