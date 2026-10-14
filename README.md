# Football Coach v4 — Full Speed O23
Zelfstandige build; heeft geen V3-map of oudere runtimebestanden nodig.

## Richting
De nieuwste groene mobiele UI/UX is leidend. De app behoudt de V3-code in deze build en voegt v4-datavelden/helpers toe voor spelerontwikkeling, wellness/RPE, opponentdossiers, live match events, media/context en deep links. Mobiel krijgt de nieuwe vijfdelige hoofdnav; desktop kan de bestaande sidebar blijven gebruiken.

## Zeer belangrijk
De oudere v2.2/v2.7 codebasis bevat aantoonbaar uitgebreidere functies (o.a. sync, bronnen, uitgebreide tactiek/opslag) dan de vereenvoudigde V3. Die bron was tijdens deze build wel geïndexeerd maar niet als volledig raw bestand beschikbaar. Daarom is deze ZIP een zelfstandige v4-kandidaat, maar niet gelabeld als 'regressievrij t.o.v. v2.7' totdat de oude volledige bestanden tegen deze build zijn getest/ingevoegd.

Maak vóór gebruik een JSON-back-up. Test minimaal: spelers, aanwezigheid, trainingen, oefeningen, wedstrijden, tactiek, seizoen, stats, notities, documenten, assistent, instellingen, sync, PDF/Books en dataherstel.

## v4.1 — wijzigingen en beperkingen
- Spelers: instelbare basisstatus, rugnummer, voorkeursvoet, contact, "ook beschikbaar voor" andere teams (officiële teamindeling blijft ongewijzigd).
- Wedstrijdformulier (tab Minuten): alleen rugnummer, naam, selectie, basis/inval en statistieken; geen posities. Gastspelers worden getoond, spelers komen maar één keer voor en dezelfde dag dubbel selecteren geeft een waarschuwing. Positiegegevens en tactiek blijven elders bestaan.
- Oefeningenbibliotheek (alleen gevuld als die leeg was), trainingsplan uit bibliotheek, periodiseringsblokken, ontwikkeldoelen met meetmoment/afronden.
- Opslag: alle data in `localStorage` (`footballCoachDataV2`); veiligheidskopieën bij migratie (`.pre-migration`) en herstel (`.pre-restore`).
- **Sync:** er is géén automatische synchronisatie tussen apparaten. Gebruik de JSON-back-up/herstel in Instellingen.
