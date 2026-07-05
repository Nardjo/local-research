import { useSignal } from "@preact/signals";
import { type ComponentChild } from "preact";
import { type LocationHook } from "preact-iso";
import { useEffect } from "preact/hooks";
import { withViewTransition } from "../functions/dom.ts";
import { jsonFetch } from "../functions/http.ts";
import { matchMiddlewares } from "../functions/middleware/middlewares.tsx";
import { getSearchScope } from "../functions/searchScopes.ts";

type SearchResultLink = {
  title: string;
  url: string;
};

export type SearchResult = {
  url: string;
  title: string;
  desc: string;
  domain: string;
  author?: string;
  related?: SearchResultLink[];
  siteName?: string;
  image?: string;
  thumb?: string;
  width?: number;
  height?: number;
};

const baseTitle = "Research";

export type SearchColumn = {
  engine: string;
  results: SearchResult[];
};

export function useSearchResults(location: LocationHook) {
  const columns = useSignal<SearchColumn[]>([]);
  const query = location.query.q;
  const scope = getSearchScope(location.query.scope, location.query.engine);
  const isFetching = useSignal(false);
  const component = useSignal<ComponentChild>(null);

  // Update title according to query
  useEffect(() => {
    document.title = query ? `${query} - ${baseTitle}` : baseTitle;
  }, [query]);

  const pushColumn = (engineName: string, results: SearchResult[]) => {
    withViewTransition(() => {
      columns.value = [...columns.value, { engine: engineName, results }];
    });
  };

  useEffect(() => {
    if (!query) {
      withViewTransition(() => {
        columns.value = [];
        document.body.classList.remove("has-results");
      });
      return;
    }
    document.body.classList.add("has-results");

    // Check if a smart function or bang intercepts the search
    component.value = matchMiddlewares(query);
    if (component.value) {
      return;
    }

    columns.value = [];
    const abortController = new AbortController();
    const signal = abortController.signal;
    isFetching.value = true;

    jsonFetch<SearchResult[]>(scope.endpoint, {
      query: { q: query },
      signal,
    })
      .then((results) => {
        pushColumn(scope.label, results);
      })
      .catch(() => {
        if (!signal.aborted) {
          columns.value = [];
        }
      })
      .finally(() => {
        if (!signal.aborted) {
          isFetching.value = false;
        }
      });

    return () => abortController.abort();
  }, [query, scope.id]);

  return { columns, query, isFetching, component, scope };
}
