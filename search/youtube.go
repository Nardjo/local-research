package search

import (
	"encoding/json"
	"fmt"
	"io"
	"local-research/utils"
	"net/url"
	"strings"
)

func GetYouTubeResults(q string) ([]SearchResult, error) {
	searchURL := fmt.Sprintf("https://www.youtube.com/results?search_query=%s", url.QueryEscape(q))
	res, err := utils.Fetch(searchURL)

	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	return parseYouTubeResultsFromHTML(string(body))
}

func parseYouTubeResultsFromHTML(html string) ([]SearchResult, error) {
	data, ok := extractYouTubeInitialData(html)
	if !ok {
		return []SearchResult{}, nil
	}

	var payload any
	if err := json.Unmarshal(data, &payload); err != nil {
		return nil, err
	}

	results := []SearchResult{}
	seen := map[string]bool{}
	collectYouTubeResults(payload, &results, seen)

	return results, nil
}

func extractYouTubeInitialData(html string) ([]byte, bool) {
	for _, marker := range []string{
		"var ytInitialData =",
		"var ytInitialData=",
		"ytInitialData =",
		"ytInitialData=",
	} {
		markerIndex := strings.Index(html, marker)
		if markerIndex == -1 {
			continue
		}

		jsonStartOffset := strings.Index(html[markerIndex:], "{")
		if jsonStartOffset == -1 {
			continue
		}

		jsonStart := markerIndex + jsonStartOffset
		if jsonEnd, ok := findJSONEnd(html, jsonStart); ok {
			return []byte(html[jsonStart : jsonEnd+1]), true
		}
	}

	return nil, false
}

func findJSONEnd(value string, start int) (int, bool) {
	depth := 0
	inString := false
	escaped := false

	for i := start; i < len(value); i++ {
		character := value[i]

		if escaped {
			escaped = false
			continue
		}

		if inString {
			if character == '\\' {
				escaped = true
				continue
			}
			if character == '"' {
				inString = false
			}
			continue
		}

		switch character {
		case '"':
			inString = true
		case '{':
			depth++
		case '}':
			depth--
			if depth == 0 {
				return i, true
			}
		}
	}

	return 0, false
}

func collectYouTubeResults(node any, results *[]SearchResult, seen map[string]bool) {
	switch value := node.(type) {
	case map[string]any:
		if renderer, ok := value["videoRenderer"].(map[string]any); ok {
			if result, ok := parseVideoRenderer(renderer); ok && !seen[result.URL] {
				seen[result.URL] = true
				*results = append(*results, result)
			}
		}

		for _, child := range value {
			collectYouTubeResults(child, results, seen)
		}
	case []any:
		for _, child := range value {
			collectYouTubeResults(child, results, seen)
		}
	}
}

func parseVideoRenderer(renderer map[string]any) (SearchResult, bool) {
	videoID, ok := renderer["videoId"].(string)
	if !ok || videoID == "" {
		return SearchResult{}, false
	}

	title := youtubeText(renderer["title"])
	if title == "" {
		return SearchResult{}, false
	}

	author := firstText(
		youtubeText(renderer["ownerText"]),
		youtubeText(renderer["shortBylineText"]),
		youtubeText(renderer["longBylineText"]),
	)
	views := firstText(
		youtubeText(renderer["viewCountText"]),
		youtubeText(renderer["shortViewCountText"]),
	)
	published := youtubeText(renderer["publishedTimeText"])
	duration := youtubeText(renderer["lengthText"])
	description := firstText(
		youtubeText(renderer["descriptionSnippet"]),
		youtubeSnippetText(renderer["detailedMetadataSnippets"]),
	)

	return SearchResult{
		URL:      "https://www.youtube.com/watch?v=" + videoID,
		Title:    title,
		Desc:     joinTextParts(author, views, published, duration, description),
		Domain:   "www.youtube.com",
		SiteName: "YouTube",
		Author:   author,
	}, true
}

func youtubeSnippetText(value any) string {
	snippets, ok := value.([]any)
	if !ok || len(snippets) == 0 {
		return ""
	}

	for _, snippet := range snippets {
		snippetMap, ok := snippet.(map[string]any)
		if !ok {
			continue
		}
		text := youtubeText(snippetMap["snippetText"])
		if text != "" {
			return text
		}
	}

	return ""
}

func youtubeText(value any) string {
	switch typedValue := value.(type) {
	case string:
		return cleanYouTubeText(typedValue)
	case map[string]any:
		if text, ok := typedValue["simpleText"].(string); ok {
			return cleanYouTubeText(text)
		}
		if text, ok := typedValue["content"].(string); ok {
			return cleanYouTubeText(text)
		}
		if runs, ok := typedValue["runs"].([]any); ok {
			parts := []string{}
			for _, run := range runs {
				runMap, ok := run.(map[string]any)
				if !ok {
					continue
				}
				if text, ok := runMap["text"].(string); ok {
					parts = append(parts, text)
				}
			}
			return cleanYouTubeText(strings.Join(parts, ""))
		}
	case []any:
		parts := []string{}
		for _, item := range typedValue {
			if text := youtubeText(item); text != "" {
				parts = append(parts, text)
			}
		}
		return cleanYouTubeText(strings.Join(parts, " "))
	}

	return ""
}

func cleanYouTubeText(value string) string {
	return strings.Join(strings.Fields(value), " ")
}

func firstText(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}

func joinTextParts(values ...string) string {
	parts := []string{}
	for _, value := range values {
		if value != "" {
			parts = append(parts, value)
		}
	}
	return strings.Join(parts, " - ")
}
