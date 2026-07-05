import { SearchResult } from "../../hooks/useSearchResults.tsx";
import { domainName } from "../../functions/string.ts";

type Props = {
  results: SearchResult[];
};

export function SearchImageGrid({ results }: Props) {
  return (
    <div class="search-image-grid">
      {results.map((result) => {
        const image = result.thumb || result.image;
        if (!image) {
          return null;
        }

        return (
          <a
            class="search-image"
            href={result.url}
            rel="noopener noreferrer"
            key={result.image}
          >
            <img src={image} alt="" loading="lazy" />
            <span class="search-image__title">{result.title}</span>
            <span class="search-image__source">{domainName(result.url)}</span>
          </a>
        );
      })}
    </div>
  );
}
