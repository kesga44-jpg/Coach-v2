# Football Coach – schone repository v2.1.6

Dit is de complete set bestanden die in de GitHub-repository moet blijven staan.

## Bewaren

- `index.html` – hoofdscherm en navigatie
- `app.js` – alle appfunctionaliteit
- `style.css` – volledige responsive vormgeving voor iPhone, iPad en laptop
- `starter-data.js` – oorspronkelijke Full Speed O23-startdata
- `manifest.json` – PWA-instellingen
- `sw.js` – service worker/offline cache
- `icon-192.png` – appicoon
- `icon-512.png` – appicoon
- `.nojekyll` – voorkomt ongewenste GitHub Pages/Jekyll-verwerking
- `README.md` – deze uitleg

Alle andere oude versies, ZIP-bestanden, losse back-ups, `starter-data.json`, changelogs en tijdelijke bestanden kunnen uit de repository worden verwijderd.

## Belangrijk

Het verwijderen van oude bestanden uit GitHub verwijdert niet automatisch je actuele lokale appdata of reeds gesynchroniseerde Supabase-data. Maak voor de zekerheid eerst via **Instellingen → Back-up downloaden** een JSON-back-up.

De zichtbare synchronisatie-instelling gebruikt alleen de **Secret key**. Andere syncgegevens blijven verborgen in de appcode, zoals eerder ingesteld.

## Mobiele wedstrijdweergave

Deze versie bevat de laatste mobiele wijzigingen:

- vaste mobiele breedte zonder horizontaal uitlopende wedstrijdpagina;
- header en bovenste knoppen volgen dezelfde mobiele breedte;
- alleen gekozen bankspelers worden onder het veld getoond;
- geen blok met “Niet geselecteerd”;
- bank wijzigen via **Bank kiezen**;
- spelers worden standaard bij hun primaire/eerste team ingedeeld; beschikbaarheid voor andere teams wordt alleen gebruikt bij groeps-/selectiekeuze.
