# FoxVote API-endepunkter

Base URL i testmiljø: `http://10.12.2.222:4000`

Interaktiv dokumentasjon:
- Swagger UI: `/api/docs`
- OpenAPI JSON: `/api/docs.json`
- OpenAPI YAML: `backend/docs/openapi.yaml`

## Endepunkter

### `GET /api/foxes/pair`
- Henter to tilfeldige rever som alltid er ulike.
- Svar:
```json
{
  "left": { "foxId": 45, "imageUrl": "https://randomfox.ca/images/45.jpg" },
  "right": { "foxId": 72, "imageUrl": "https://randomfox.ca/images/72.jpg" }
}
```

### `POST /api/votes`
- Registrerer en stemme på en rev.
- Request body:
```json
{
  "foxId": 45,
  "imageUrl": "https://randomfox.ca/images/45.jpg"
}
```
- Svar:
```json
{
  "ok": true,
  "leader": { "foxId": 45, "imageUrl": "https://randomfox.ca/images/45.jpg", "votes": 8 },
  "top": [
    { "foxId": 45, "imageUrl": "https://randomfox.ca/images/45.jpg", "votes": 8 }
  ],
  "nextPair": {
    "left": { "foxId": 4, "imageUrl": "https://randomfox.ca/images/4.jpg" },
    "right": { "foxId": 88, "imageUrl": "https://randomfox.ca/images/88.jpg" }
  },
  "warning": null
}
```

### `GET /api/stats/top?limit=5`
- Returnerer toppliste sortert på flest stemmer.

### `GET /api/stats/leader`
- Returnerer lederen akkurat nå, eller `null` hvis ingen stemmer finnes.

### `GET /health`
- Enkel helse-sjekk for monitorering.
