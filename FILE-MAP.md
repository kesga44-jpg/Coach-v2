# FILE MAP — Football Coach
## Runtime
`index.html`
→ laadt `style.css`
→ laadt `app.js`
→ verwijst naar `manifest.json`
→ registreert `sw.js`

`app.js` bevat de volledige actuele applicatielogica: state, opslag, router, renderfuncties en events.
`style.css` bevat alle actuele styling.
`manifest.json` verwijst naar `icon-192.png` en `icon-512.png`.
`sw.js` cached alleen de actuele runtimebestanden.

Er worden geen oudere app.js-bestanden, update-scripts of versiemappen aangeroepen.
