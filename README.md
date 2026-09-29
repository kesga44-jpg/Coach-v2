# Football Coach V3 — Full Speed O23

## Wat deze versie toevoegt
- Wedstrijddag in 5 stappen: plan, live, speelminuten, tegenstanderdossier, evaluatie.
- Live gebeurtenissen en coachnotities.
- Speelminuten, basis/inval, positie, goals, assists en wedstrijd-RPE.
- Spelerontwikkeling met doelen, acties, criteria en meetmomenten door de tijd.
- Trainingsmonitoring: aanwezigheid, sessie-RPE × minuten, pijn, spierpijn, vermoeidheid en motivatie.
- 7-daagse geregistreerde belasting als coachsignaal (geen blessurevoorspelling).
- Training → hoofdthema → evaluatie → volgende stap.
- O23-methodiek rechtstreeks in dashboard, trainingen, tactiek en seizoen.
- Tegenstanderdossier met formatie, opbouw, pressing, sterktes/zwaktes en standaardsituaties.
- Lokale coachassistent op basis van eigen data en vaste O23-regels.
- JSON back-up/import en behoud van `footballCoachDataV2`.

## Documentatielogica
Deze build volgt de aangeleverde O23-documentatie:
- dinsdag ontwikkelen;
- donderdag aanscherpen / hogere beslisdruk;
- zaterdag toetsen;
- maximaal één hoofdprobleem per ontwikkelweek;
- vaste coachtaal: centrum dicht, naar buiten, aansluiten, doorstappen, rugdekking, vijf seconden;
- welzijn vóór de sessie en sessie-RPE × minuten erna;
- minutenbanden groen 75–90, oranje 45–60, rood individueel/aangepast;
- wedstrijdobservaties terugvoeren naar de volgende training.

## Updaten zonder data kwijt te raken
1. Maak in je huidige app eerst een JSON-back-up.
2. Vervang op GitHub de oude `index.html`, `app.js`, `style.css`, `manifest.json` en `sw.js` door deze bestanden.
3. Laat de GitHub Pages URL/repository gelijk. De browser gebruikt dezelfde localStorage-key: `footballCoachDataV2`.
4. Open de app en controleer spelers, aanwezigheid en wedstrijden.
5. Importeer de JSON-back-up alleen als gegevens niet automatisch zichtbaar zijn.
6. Op iPhone kan een oude service-worker-cache blijven hangen. Sluit de PWA volledig en open opnieuw; indien nodig verwijder de beginscherm-app en voeg dezelfde URL opnieuw toe.

## PDF / iPhone / Boeken
Gebruik in een wedstrijd `Evaluatie` → `Print / PDF / Boeken`. Op iPhone/iPad: Deel/Print, open de afdrukpreview groot en kies opnieuw Deel. Daarna kun je bewaren in Bestanden of naar Boeken sturen. De print-CSS is compact en probeert kaarten niet over pagina's te breken.

## Belangrijk
- Welzijn en load zijn coachondersteuning, geen medische diagnose.
- De app berekent geen blessurekans.
- Bewaar vóór grote wijzigingen altijd een JSON-back-up.
