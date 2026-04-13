# Brukerveiledning for FoxVote

## Slik bruker du løsningen
1. Åpne nettsiden i nettleser.
2. Du får se to tilfeldige bilder av rever.
3. Trykk på knappen under reven du synes er søtest.
4. Du får en tydelig bekreftelse på at stemmen er registrert.
5. Topplisten oppdateres automatisk med de mest populære revene.
6. En toast viser hvilken rev som leder akkurat nå.

## Universell utforming
- Knappene kan brukes med tastatur.
- Fokusmarkering er synlig.
- Bilder har alt-tekst.
- Viktige meldinger vises med semantiske ARIA-roller.
- Grensesnittet fungerer på desktop og mobil.

## Vanlige feil og løsning
1. **Ingen bilder vises**
   - Sjekk om backend er oppe (`/health`).
   - Sjekk internett-tilgang mot `randomfox.ca`.
2. **Stemmegivning feiler**
   - Sjekk at API svarer på `/api/votes`.
   - Sjekk CORS-innstilling `FRONTEND_ORIGIN`.
3. **Toppliste oppdateres ikke**
   - Sjekk backend-logg.
   - Sjekk at databasen kjører (`systemctl status mongod`).
4. **Siden laster, men viser feiltoast**
   - Verifiser at frontend peker til riktig `BACKEND_BASE_URL`.
