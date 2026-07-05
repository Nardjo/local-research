package search

import "testing"

func TestParseYouTubeResultsFromHTML(t *testing.T) {
	html := `<html><script>
var ytInitialData = {
  "contents": {
    "twoColumnSearchResultsRenderer": {
      "primaryContents": {
        "sectionListRenderer": {
          "contents": [
            {
              "itemSectionRenderer": {
                "contents": [
                  {
                    "videoRenderer": {
                      "videoId": "abc123def45",
                      "title": {
                        "runs": [{"text": "Comprendre l'IA"}]
                      },
                      "ownerText": {
                        "runs": [{"text": "Science Channel"}]
                      },
                      "viewCountText": {
                        "simpleText": "42 k vues"
                      },
                      "publishedTimeText": {
                        "simpleText": "il y a 2 jours"
                      },
                      "lengthText": {
                        "simpleText": "12:34"
                      },
                      "descriptionSnippet": {
                        "runs": [{"text": "Une introduction claire."}]
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
};
</script></html>`

	results, err := parseYouTubeResultsFromHTML(html)
	if err != nil {
		t.Fatalf("parseYouTubeResultsFromHTML returned error: %v", err)
	}

	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}

	result := results[0]
	if result.URL != "https://www.youtube.com/watch?v=abc123def45" {
		t.Errorf("expected YouTube URL, got %q", result.URL)
	}
	if result.Title != "Comprendre l'IA" {
		t.Errorf("expected title, got %q", result.Title)
	}
	if result.Author != "Science Channel" {
		t.Errorf("expected author, got %q", result.Author)
	}
	if result.Desc != "Science Channel - 42 k vues - il y a 2 jours - 12:34 - Une introduction claire." {
		t.Errorf("expected description metadata, got %q", result.Desc)
	}
}
