# PRD: Recherche a une colonne et onglets de portee

## Problem Statement

La recherche actuelle affiche deux colonnes pour une recherche web standard, une pour DuckDuckGo et une pour Startpage. Cette presentation donne l'impression de comparer deux moteurs plutot que de lire une seule liste de resultats utile. Elle occupe beaucoup d'espace, rend la lecture moins fluide et ne correspond pas au besoin exprime: une recherche simple, lisible, basee sur DuckDuckGo.

L'outil a deja des forces importantes: il est local, rapide, sans publicite, personnalisable, avec des bangs et des reponses instantanees. Le probleme est que la recherche principale n'a pas encore une notion claire de "portee" utilisateur. Aujourd'hui, le choix technique des moteurs se voit directement dans l'interface sous forme de colonnes.

## Solution

Remplacer le comportement de recherche web standard par une seule liste de resultats DuckDuckGo, puis introduire des onglets de portee pour changer explicitement le type de recherche.

La recherche par defaut devient:

- Une requete web normale utilise DuckDuckGo uniquement.
- Les resultats sont affiches dans une seule colonne.
- L'interface ne montre plus Startpage comme deuxieme colonne par defaut.

Les onglets de portee donnent une navigation claire:

- `Web`: recherche web standard via DuckDuckGo.
- `Videos`: recherche video via la portee YouTube existante.
- `GitHub`: recherche orientee code, depot ou issues via une redirection ou une integration dediee.
- `Docs`: recherche orientee documentation technique, d'abord via une redirection ciblee ou des bangs existants.

Le MVP doit rester simple: il formalise la portee de recherche, conserve les middlewares existants, et evite d'ajouter plusieurs moteurs concurrents dans la meme vue.

## User Stories

1. As a local search user, I want a normal web query to show one result list, so that I can scan results without comparing engines.
2. As a local search user, I want DuckDuckGo to be the default web source, so that the behavior matches my expectation.
3. As a local search user, I want desktop search results to stay in one column, so that the page remains focused and readable.
4. As a local search user, I want mobile search results to keep the same single-list behavior, so that the interface feels consistent across screen sizes.
5. As a local search user, I want the current query to stay in the search box, so that I can refine it quickly.
6. As a local search user, I want the selected search scope to be visible, so that I know what kind of search I am running.
7. As a local search user, I want to switch from Web to Videos, so that I can reuse the same query for YouTube results.
8. As a local search user, I want to switch back from Videos to Web, so that I can recover normal web results without retyping the query.
9. As a local search user, I want a GitHub scope, so that developer-oriented searches do not require remembering a bang.
10. As a local search user, I want a Docs scope, so that documentation searches are faster to launch.
11. As a local search user, I want the active scope to be encoded in the URL, so that I can refresh or share the current search state.
12. As a local search user, I want a missing scope parameter to default to Web, so that old URLs continue to work.
13. As a local search user, I want unknown scope parameters to fall back safely to Web, so that malformed URLs do not break the page.
14. As a local search user, I want bangs to keep working, so that existing shortcuts remain useful.
15. As a local search user, I want direct URL queries to keep redirecting, so that the search box remains a launcher.
16. As a local search user, I want instant answers to keep appearing before web results, so that timer, calculation and text helpers stay fast.
17. As a local search user, I want the loading state to reflect the active scope, so that I understand when the current search is still fetching.
18. As a local search user, I want failed secondary scopes to fail gracefully, so that the interface does not get stuck in loading.
19. As a local search user, I want no empty second column, so that failed or disabled engines do not waste space.
20. As a local search user, I want scope tabs to be keyboard reachable, so that the feature is usable without a mouse.
21. As a local search user, I want scope tabs to have clear focus states, so that keyboard navigation is visible.
22. As a local search user, I want the selected scope to survive a search submit, so that I can run several searches in the same mode.
23. As a local search user, I want submitting a query from the homepage to default to Web, so that the homepage remains simple.
24. As a local search user, I want result cards to keep their existing favicon, title, description and domain behavior, so that the change does not remove useful information.
25. As a local search user, I want the search page to remain fast, so that adding scopes does not slow down the default path.
26. As a local search user, I want Startpage not to be fetched for normal searches, so that the default request path is lighter.
27. As a local search user, I want old Startpage backend code to remain available only if intentionally used later, so that the MVP does not require deleting unrelated functionality.
28. As a local search user, I want the layout to remain polished with zero, one or many results, so that the page does not look broken in edge cases.
29. As a local search user, I want the selected scope to be visually compact, so that the search input remains the primary focus.
30. As a local search user, I want future scopes to be easy to add, so that Images or Local can be introduced later without rewriting the search flow.
31. As a developer, I want search scope selection to be represented as a small explicit model, so that the mapping from scope to endpoint is easy to reason about.
32. As a developer, I want the result-fetching flow to be testable without rendering the whole app, so that regressions in engine selection are easy to catch.
33. As a developer, I want the layout behavior to be covered by a practical check, so that the two-column regression does not return accidentally.
34. As a developer, I want existing parser tests to remain focused on parsers, so that frontend scope behavior and backend parsing do not get mixed.
35. As a developer, I want no new abstraction unless it reduces real duplication, so that the codebase stays small.

## Implementation Decisions

- The product language should use "portee" for the user-facing search mode and "engine" only for backend/API implementation details.
- A standard query with no explicit scope resolves to the Web scope.
- The Web scope fetches DuckDuckGo only.
- The Videos scope maps to the existing YouTube search capability.
- The GitHub and Docs scopes can start as URL-based redirects or bang-backed scopes if a native API integration would make the MVP too large.
- The result page should render one list for the active scope, not one column per backend engine.
- The existing search result item shape should remain stable for the MVP: title, URL, description, domain, optional author, optional related links and optional site name.
- The search result hook should own scope resolution and endpoint selection.
- The search page should own presentation: search form, instant answer component, scope tabs and result list.
- The URL should keep `q` for the query and use one explicit parameter for scope.
- Existing query URLs without a scope parameter should continue to work and default to Web.
- Bangs and instant answers should continue to intercept before network search.
- Startpage should not be fetched by default. Keeping the backend parser or endpoint is acceptable as long as it is not part of the default search path.
- The CSS grid for search results should not force two equal columns at desktop sizes for the default result list.
- Scope tabs should be compact controls near the search form, not a large marketing-style navigation.
- Scope tabs should be available only when useful: either when a query exists or in the search header if the design remains clean.
- The MVP should avoid cache, deduplication, editable blocklists and local document indexing unless they are needed to make the scope feature work.

## Testing Decisions

- Good tests should assert external behavior: which scope is selected, which endpoint is requested, what result list is displayed, and whether the URL state is preserved.
- The highest-value seam is the search result flow that turns `q` plus scope into fetch calls and rendered results.
- Frontend tests should cover that a default web query requests DuckDuckGo only and does not request Startpage.
- Frontend tests should cover that the Videos scope requests the YouTube search path.
- Frontend tests should cover that an unknown scope falls back to Web.
- Frontend tests should cover that middlewares can still intercept before a network request.
- Layout verification should include at least a desktop check that search results do not render as two columns for a normal web query.
- Existing backend parser tests should continue to validate individual parsers.
- Existing server handler tests should continue to validate server rendering and redirects.
- If adding native GitHub or Docs integrations later, those integrations should get separate parser/API tests instead of being coupled to the scope-tab tests.

## Out of Scope

- Building a full image search experience.
- Indexing local files, notes or documents.
- Adding a cache layer for repeated searches.
- Building a full UI for editing the blocklist.
- Re-ranking and deduplicating results across multiple engines.
- Removing Startpage backend code.
- Replacing the existing bang system.
- Redesigning the homepage or wallpaper system.
- Changing install, build or service behavior.

## Further Notes

The first implementation slice should be intentionally small: Web becomes DuckDuckGo-only, results stay in one column, and the code introduces a minimal search-scope model. Once that is stable, scope tabs can expose Videos, GitHub and Docs progressively.

This PRD assumes the project remains a personal local search tool, not a hosted multi-user search product.
