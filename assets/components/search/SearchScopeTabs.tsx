import clsx from "clsx";
import { searchScopes, type SearchScopeId } from "../../functions/searchScopes.ts";

type Props = {
  activeScope: SearchScopeId;
  onScopeChange: (scope: SearchScopeId) => void;
};

export function SearchScopeTabs({ activeScope, onScopeChange }: Props) {
  return (
    <div class="search-scopes" role="tablist" aria-label="Search scope">
      {searchScopes.map((scope) => (
        <button
          type="button"
          role="tab"
          aria-selected={scope.id === activeScope}
          class={clsx(
            "search-scopes__tab",
            scope.id === activeScope && "is-active",
          )}
          onClick={() => onScopeChange(scope.id)}
          key={scope.id}
        >
          {scope.label}
        </button>
      ))}
    </div>
  );
}
