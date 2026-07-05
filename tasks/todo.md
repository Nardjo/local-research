# Todo

## Commit and push

- [x] Revoir le statut Git et le perimetre du commit.
- [x] Relancer les checks avant commit.
- [x] Commit tous les changements demandes.
- [x] Push la branche courante.

## Favicon

- [x] Creer un favicon SVG source avec une loupe minimaliste.
- [x] Generer les PNG existants depuis le SVG.
- [x] Exposer le SVG dans le layout avec le PNG en fallback.
- [x] Verifier les fichiers generes et le build minimal.
- [x] Rebuild le container Docker et verifier le healthcheck.

## Local `!ia` bang

- [x] Reproduire la redirection actuelle de `!ia`.
- [x] Remplacer `!ia` par une recherche locale `ia`.
- [x] Deplacer la redirection Perplexity de `!ia` vers `!pp`.
- [x] Retirer la redirection Perplexity locale, deja couverte par Helium.
- [x] Ajouter un test de regression serveur.
- [x] Rebuild et verifier le container.

## Images scope

- [x] Ajouter une source backend DuckDuckGo Images avec parsing testable.
- [x] Exposer `/api/images`.
- [x] Ajouter la portee `Images` cote frontend.
- [x] Afficher les resultats image en grille dediee.
- [x] Verifier via tests, build, API locale et container Docker.

## Theme mode

- [x] Confirmer le comportement attendu: controle a 3 etats `Systeme`, `Clair`, `Sombre`.
- [x] Ajouter un module frontend de theme avec preference persistante et ecoute de `prefers-color-scheme`.
- [x] Ajouter le controle de theme dans le header et preserver l'ergonomie mobile/desktop.
- [x] Ajouter les variables CSS light/dark et adapter les surfaces qui forcent le theme sombre.
- [x] Verifier avec les checks frontend disponibles et une inspection visuelle locale.

- [x] Reproduire le header non centre et l'onglet Videos vide.
- [x] Centrer le groupe de recherche dans le header avec resultats.
- [x] Remplacer le parsing YouTube HTML par un parsing de `ytInitialData`.
- [x] Ajouter un test Go du parsing YouTube sans appel reseau.
- [x] Rebuild et verifier `Web`, `Videos`, `/health`.
- [x] Ajouter un modele de portee de recherche minimal avec fallback `web`.
- [x] Faire utiliser uniquement DuckDuckGo a la portee `web`.
- [x] Ajouter les onglets de portee `Web` et `Videos` en conservant la requete courante.
- [x] Garder les resultats en une seule colonne sur desktop.
- [x] Ajouter des tests frontend sur la resolution de portee et les endpoints appeles.
- [x] Lancer les checks disponibles et corriger les regressions.
- [x] Relire le diff et noter la review.
- [x] Corriger le Dockerfile pour un rebuild reproductible.
- [x] Ajouter l'endpoint `/health` attendu par Docker Compose.
- [x] Rebuild le container et verifier son healthcheck.

## Review

- Favicon remplace par une loupe minimaliste sur fond sombre avec accent rouge.
- Ajout de `public/favicon.svg` et `public/assets/favicon.svg`.
- `public/favicon.png` et `public/assets/favicon.png` regeneres en 32x32 depuis le SVG via `rsvg-convert`.
- Le layout expose maintenant `/favicon.svg` avec `/favicon.png` en fallback.
- Verification OK: apercu visuel du PNG agrandi, `file`, `magick identify`, `git diff --check`, `go build -o /tmp/local-research-favicon-check`.
- Container Docker rebuild via `docker compose up -d --build local-research`; verification OK: container `healthy`, `/favicon.svg` et `/favicon.png` repondent `200`.
- `!ia` n'est plus une redirection externe vers Perplexity.
- `!ia` est maintenant remplace par `ia` cote recherche locale, y compris pour `!ia assistant`.
- La redirection Perplexity locale a ete retiree, car elle est deja couverte par Helium.
- Verification OK: `go test ./server`, `bun run test`, `bun run check`, `bun run build`.
- Verification container OK: `/?q=!ia` repond `200` sans redirection, `/api/ddg?q=!ia` renvoie les resultats locaux pour `ia`.
- Ajout d'un controle de theme a 3 etats dans le header: systeme, clair, sombre.
- La preference est stockee dans `localStorage` et le mode systeme suit `prefers-color-scheme`.
- Le theme resolu est applique sur `<html data-theme>` avant le chargement des assets pour limiter le flash de theme.
- Ajout des variables CSS light/dark pour la recherche, le header, les boutons et les cartes d'apps.
- Verification OK: `bun run test -- assets/functions/theme.test.ts`, `bun run test`, `bun run check`, `bun run build`, `go build`, `git diff --check`.
- Verification partielle: l'outil navigateur integre a echoue avant execution, et `go run .` n'a pas pu demarrer car le port 8042 etait deja occupe par une instance locale.
- Ajout de la portee `web` par defaut vers `/api/ddg` et `videos` vers `/api/youtube`.
- Ajout des onglets `Web` et `Videos` visibles pendant une recherche.
- Suppression de la grille deux colonnes pour les resultats desktop.
- Dockerfile corrige: `templ` est pinne sur `v0.3.943` au lieu de `latest`.
- Endpoint `/health` ajoute pour aligner l'app avec le healthcheck Docker Compose.
- Container `local-research-local-research-1` reconstruit et verifie `healthy`.
- Header de recherche recentre quand une recherche est active.
- Parser YouTube corrige: l'API lit maintenant `ytInitialData` et extrait les `videoRenderer`.
- Verification OK: `/api/youtube?q=ia` renvoie des videos YouTube.
- Verification OK: `bun run test -- assets/functions/searchScopes.test.ts`, `bun run test`, `bun run check`, `bun run build`, `go test ./server ./utils`.
- Verification KO existante: `go test ./...` echoue dans `search.TestSearchEngines/Google`, qui depend de Google en live et panique quand aucun resultat n'est retourne.
- Images: ajout de `/api/images`, portee `Images`, grille dediee et parsing DuckDuckGo Images via `vqd` + `i.js`.
- Verification images OK: `/api/images?q=chatgpt` renvoie des resultats avec `image`, `thumb`, dimensions et URL source.
- Container reconstruit apres Images et verifie `healthy`.
