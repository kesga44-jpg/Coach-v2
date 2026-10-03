# Football Coach v5.0 — Full Speed O23

Standalone master build. Runtime bestaat uit één `index.html`, één `app.js`, één `style.css`, manifest, service worker en icon.

## Belangrijkste herstelde functies
- Trainingen: toevoegen, bewerken én verwijderen.
- Wedstrijden: toevoegen, bewerken, verwijderen, openen, live klok, gebeurtenissen, opstelling, minuten, MOTM en evaluatie.
- Wedstrijdblad: echte PDF via jsPDF, A4 en één pagina; delen via iOS Web Share wanneer bestand delen wordt ondersteund. Als de iPhone geen file-share ondersteunt, wordt de PDF lokaal gedownload.
- Spelers: toevoegen, bewerken, verwijderen, selectie, positie, nummer, ontwikkeldoel, notities.
- Oefeningen: toevoegen, bewerken, verwijderen.
- Coachnotities: toevoegen, bewerken, verwijderen.
- Bronnen: toevoegen/verwijderen.
- Tactiekbord, Spelmodel, seizoen, statistieken, aanwezigheid.
- Backup export/import.
- Eenmalige migratie van `footballCoachDataV2` / `footballCoachDataV1` naar `footballCoachApp`.
- Geen runtime-afhankelijkheid van oude updatebestanden.

## PDF naar Boeken
De app maakt een echte PDF. Op iPhone/iPad wordt `navigator.share()` gebruikt als file sharing beschikbaar is. In de iOS deel-sheet kan de gebruiker daarna bijvoorbeeld **Boeken** of **Bewaar in Bestanden** kiezen. Direct een bestand naar Boeken forceren kan een webapp niet betrouwbaar afdwingen.

## Testvolgorde
1. Open eerst in een privévenster.
2. Controleer spelers.
3. Voeg testtraining toe → bewerken → verwijderen.
4. Voeg testwedstrijd toe → open → opstelling/minuten → PDF.
5. Deel de PDF op iPhone.
6. Controleer backup export/import.
7. Controleer oude data-migratie.
8. Pas daarna op GitHub `test-v5-0` zetten en via Pull Request naar `main` mergen.

## Bronstatus
BEWEZEN = bestaande Coach-functies uit de eerdere code-inventaris.
BESLOTEN = gewenste herstelde/uitgebreide functies.
