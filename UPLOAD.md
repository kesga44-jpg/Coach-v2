# Uploaden zonder oude versies
1. Maak vanaf je huidige `main` een aparte testbranch.
2. Verwijder in die testbranch de oude runtimebestanden die door deze clean release worden vervangen.
3. Upload vervolgens **alle bestanden uit deze map** naar de repository-root.
4. Controleer dat `index.html` alleen de bestanden uit `FILE-MAP.md` laadt.
5. Test `09-TEST-CHECKLIST.md`.
6. Merge pas daarna naar `main`.

Deze release moet als complete snapshot worden gebruikt, niet als losse patch bovenop een oudere release.
