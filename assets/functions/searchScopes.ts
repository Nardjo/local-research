export const searchScopes = [
  {
    id: "web",
    label: "Web",
    endpoint: "/api/ddg",
  },
  {
    id: "images",
    label: "Images",
    endpoint: "/api/images",
  },
  {
    id: "videos",
    label: "Videos",
    endpoint: "/api/youtube",
  },
] as const;

export type SearchScopeId = (typeof searchScopes)[number]["id"];

const fallbackScope: SearchScopeId = "web";

export function resolveSearchScope(
  scope?: string,
  legacyEngine?: string,
): SearchScopeId {
  if (scope && searchScopes.some((searchScope) => searchScope.id === scope)) {
    return scope as SearchScopeId;
  }

  if (legacyEngine === "youtube") {
    return "videos";
  }

  return fallbackScope;
}

export function getSearchScope(scope?: string, legacyEngine?: string) {
  const scopeId = resolveSearchScope(scope, legacyEngine);
  return searchScopes.find((searchScope) => searchScope.id === scopeId)!;
}

export function getSearchScopeEndpoint(scope: SearchScopeId): string {
  return getSearchScope(scope).endpoint;
}
