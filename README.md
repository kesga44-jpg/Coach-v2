# Football Coach V2 — Full Speed O23

Responsive GitHub Pages/PWA voor teambeheer, aanwezigheid, trainingen, oefeningen, wedstrijden, tactiek en coachanalyse.

## Wat zit erin?

### Teams & spelers
- Meerdere teams aanmaken (bijv. O23, 1e elftal, Vrouwen 1).
- Speler kan in meerdere teams staan en heeft één primair team.
- Profiel bewerken: positie, alternatieve posities, rugnummer, voorkeursbeen, geboortedatum, selectiestatus, ontwikkeldoelen en coachnotities.
- Ontwikkelscores voor techniek, tactiek, fysiek, mentaal en inzet.
- Opkomst en wedstrijdstatistieken op het spelersprofiel.

### Aanwezigheid
- Aanwezigheid per training of wedstrijd.
- Standaard wordt het gekozen team gebruikt.
- Per activiteit kan een eigen groep/selectie worden ingesteld.
- Statussen: aanwezig, herstellend, traint met 1, school/werk, blessure, vakantie, ziek, geen bericht enz.
- Snelle knop om hele groep aanwezig te zetten.

### Trainingen
- Trainingen plannen per team.
- Focus, intensiteit, groep en coachnotities.
- Oefeningen uit bibliotheek aan trainingsplan toevoegen.
- Duur per oefening aanpassen.
- Coachpunten uit bibliotheek overnemen en per training aanpassen.
- Oefeningen omhoog/omlaag zetten.
- Lokale trainingsgenerator op basis van spelersaantal, duur, focus en afstand tot volgende wedstrijd.
- Wedstrijdevaluatie kan automatisch trainingsfocus voor de volgende training worden.

### Oefeningenbibliotheek
- Naam, categorie, intensiteit, spelersaantal, duur, afmetingen, materiaal, doel, organisatie, coachpunten, variaties en tags.
- Zoeken op coachpunt, trainingsdoel, tags enz.
- Bronverwijzing wanneer oefening uit een document komt.

### Documenten lezen → oefeningen
Bestanden worden in de browser op het apparaat gelezen. De app probeert oefeningsblokken te herkennen en toont eerst een controlelijst.

Ondersteund:
- PDF
- DOCX
- XLSX / XLSM / XLS
- TXT / MD / CSV

De extractor probeert o.a. te herkennen:
- oefening/naam
- doel
- organisatie
- coachpunten/coaching
- spelers
- duur
- afmeting
- materiaal
- variaties

Na controle worden geselecteerde oefeningen aan de bibliotheek toegevoegd. Oud Word `.doc` wordt niet rechtstreeks gelezen; sla dat eerst als `.docx` op.

> De PDF/Word/Excel-parsers worden via jsDelivr geladen. De inhoud van het gekozen document wordt door de app lokaal verwerkt; de app uploadt het document zelf niet naar een AI-dienst. Voor het eerst laden van deze parsers is internet nodig. Tekstgebaseerde PDF’s werken het best; gescande PDF’s zonder tekstlaag hebben OCR nodig en worden in deze versie niet automatisch herkend.

### Wedstrijden
- Wedstrijdgegevens, competitie, locatie en thuis/uit.
- Visueel voetbalveld.
- Formatietemplates: 4-3-3, 5-3-2, 4-2-3-1 en 4-4-2.
- Spelers slepen naar posities (desktop/laptop).
- Op telefoon positie aantikken en speler kiezen.
- Eigen wedstrijdselectie/groep.
- Bank automatisch zichtbaar.
- Wedstrijdchecklist.
- Teamdoel, pressing, opbouw, standaardsituaties en individuele opdrachten.
- Score, basisplaatsen, minuten, goals, assists en kaarten.
- Evaluatie: goed / verbeteren / volgende training.

### Tactiekbord
- Meerdere tactieken per team.
- Spelers, tegenstanders, pionnen en bal plaatsen.
- Pijlen en zones tekenen.
- Formatie automatisch op bord zetten.
- Tactische coachafspraken opslaan.

### Seizoen & periodisering
- Kalender rond huidige maand.
- Alle trainingen en wedstrijden in maandplanning.
- Weektemplate voor belasting/focus.
- Weekritme, belastingsniveau en periodiseringsprincipes rechtstreeks bewerkbaar.
- Losse seizoenitems toevoegen, zoals teamactiviteit, evaluatie, vergadering, vrije dag of toernooi.

### Statistieken & coachnotities
- Trainingsopkomst per speler.
- Wedstrijdminuten, basisplaatsen, goals en assists.
- Coachnotities koppelen aan speler en/of training/wedstrijd.
- Laatste aandachtspunten op dashboard.

### Coachassistent
- Werkt standaard lokaal voor vragen over aanwezigheid, wedstrijdminuten, wedstrijdevaluatie en trainingssuggesties.
- Optioneel kan een beveiligde AI-endpoint worden gekoppeld.
- Plaats nooit een geheime AI API-key rechtstreeks in GitHub Pages of `app.js`.

### Opslag & sync
- Automatische lokale opslag in de browser.
- JSON back-up export/import.
- Optionele AES-GCM versleutelde Supabase-sync tussen laptop, iPad en iPhone.

## Bestaande V1-data
V2 gebruikt `footballCoachDataV2`. Bij de eerste start kijkt de app ook naar `footballCoachDataV1` en migreert die gegevens automatisch naar het nieuwe model.

## Op GitHub Pages zetten
1. Pak de ZIP uit.
2. Maak op GitHub een repository, bijvoorbeeld `football-coach-app`.
3. Upload **alle bestanden uit de ZIP**, niet de ZIP zelf.
4. Commit de bestanden naar `main`.
5. Ga naar `Settings` → `Pages`.
6. Kies `Deploy from a branch`.
7. Branch: `main`, map: `/(root)`.
8. Klik `Save`.
9. Open de GitHub Pages-link zodra de deployment klaar is.

## iPhone / iPad als app
1. Open de GitHub Pages-link in Safari.
2. Tik op Deel.
3. Kies `Zet op beginscherm`.
4. Start daarna via het Football Coach-icoon.

## Supabase sync
Maak deze tabel in Supabase SQL Editor:

```sql
create table public.coach_data (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.coach_data enable row level security;
create policy "coach read" on public.coach_data for select to anon using (true);
create policy "coach insert" on public.coach_data for insert to anon with check (true);
create policy "coach update" on public.coach_data for update to anon using (true) with check (true);
```

Vul daarna in de app onder `Instellingen` in:
- Supabase project URL
- anon/publishable key
- willekeurig sync-ID
- sterk encryptiewachtwoord

De payload wordt vóór upload in de browser versleuteld.

## Bestanden
- `index.html` — app-shell en document-parser scripts
- `app.js` — volledige functionaliteit
- `style.css` — responsive iPhone/iPad/laptop-layout
- `starter-data.js` / `starter-data.json` — startgegevens uit je O23 Excel
- `manifest.json` — PWA-configuratie
- `sw.js` — offline cache van de app zelf
- `icon-192.png` / `icon-512.png` — appiconen

## Belangrijk
Maak vóór grote wijzigingen een JSON-back-up via `Instellingen` → `Back-up downloaden`.
