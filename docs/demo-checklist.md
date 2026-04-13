# Demo-checkliste i testmiljø

## Funksjonell demo
- [ ] To ulike rever vises ved sideinnlasting.
- [ ] Stemmeknapp registrerer stemme.
- [ ] Bruker får tydelig bekreftelse etter stemme.
- [ ] Nytt revepar vises etter stemme.
- [ ] Toppliste viser mest populære rever.
- [ ] Toast viser leder: `Rev X er søtest akkurat nå!`

## Driftssikkerhet
- [ ] Frontend, backend og DB går på separate VM-er.
- [ ] DB nås kun fra backend-IP.
- [ ] Backend nås kun fra frontend-IP.
- [ ] UFW-regler er aktive på alle VM-er.
- [ ] Tjenestene autostarter etter reboot.

## Dokumentasjon
- [ ] API-dokumentasjon (`/api/docs`) virker.
- [ ] Arkitektur + IP-plan er oppdatert.
- [ ] Sikkerhetsnotat inneholder hull, angrepstyper og tiltak.
- [ ] Brukerveiledning inneholder vanlige feil og løsninger.
