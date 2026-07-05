import { useLocation } from "preact-iso";
import { withViewTransition } from "../functions/dom.ts";
import { useSearchResults } from "../hooks/useSearchResults.tsx";
import { Timer } from "../components/Timer.tsx";
import { SearchForm } from "../components/search/SearchForm.tsx";
import { SearchImageGrid } from "../components/search/SearchImageGrid.tsx";
import { SearchItem } from "../components/search/SearchItem.tsx";
import { SearchScopeTabs } from "../components/search/SearchScopeTabs.tsx";
import { SearchThemeToggle } from "../components/search/SearchThemeToggle.tsx";
import { SearchWallpaperButton } from "../components/search/SearchWallpaperButton.tsx";
import { useArrowNavigation } from "../hooks/useArrowNavigation.ts";
import { useThemePreference } from "../hooks/useThemePreference.ts";
import { type SearchScopeId } from "../functions/searchScopes.ts";

export function SearchPage() {
  const location = useLocation();
  const { columns, query, isFetching, component, scope } =
    useSearchResults(location);
  const theme = useThemePreference();
  useArrowNavigation();

  const routeSearch = (q: string, nextScope: SearchScopeId) => {
    const url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set("q", q);
    url.searchParams.delete("engine");

    if (nextScope === "web") {
      url.searchParams.delete("scope");
    } else {
      url.searchParams.set("scope", nextScope);
    }

    withViewTransition(() => location.route(url.toString()));
  };

  const onSearch = (q: string) => {
    routeSearch(q, query ? scope.id : "web");
  };

  const onScopeChange = (nextScope: SearchScopeId) => {
    routeSearch(query ?? "", nextScope);
  };

  const showWallpaperSwitcher = !query;

  return (
    <>
      <header class="search-top">
        <SearchForm
          onSearch={onSearch}
          defaultValue={query}
          isLoading={isFetching}
        />
        {query && (
          <SearchScopeTabs
            activeScope={scope.id}
            onScopeChange={onScopeChange}
          />
        )}
        <SearchThemeToggle
          preference={theme.preference.value}
          resolvedTheme={theme.resolvedTheme.value}
          onPreferenceChange={theme.setPreference}
        />
        {component.value}
        <Timer />
      </header>
      {showWallpaperSwitcher && <SearchWallpaperButton />}
      <main
        class={`search-main ${scope.id === "images" ? "search-main--images" : ""}`}
      >
        {columns.value.map((column, index) => (
          <div class="search-column" key={index}>
            <div class="search-engine-label">{column.engine}</div>
            {scope.id === "images" ? (
              <SearchImageGrid results={column.results} />
            ) : (
              column.results.map((result, k) => (
                <SearchItem result={result} key={k} />
              ))
            )}
          </div>
        ))}
      </main>
    </>
  );
}
