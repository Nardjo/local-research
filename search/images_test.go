package search

import "testing"

func TestExtractDDGImageVQD(t *testing.T) {
	vqd, ok := extractDDGImageVQD(`var rq="chatgpt",vqd="4-123456789",safe_ddg=0;`)
	if !ok {
		t.Fatal("expected vqd to be found")
	}
	if vqd != "4-123456789" {
		t.Errorf("expected vqd, got %q", vqd)
	}
}

func TestParseDDGImageResults(t *testing.T) {
	results, err := parseDDGImageResults([]byte(`{
  "results": [
    {
      "height": 1080,
      "image": "https://example.com/image.jpg",
      "thumbnail": "https://example.com/thumb.jpg",
      "title": "Example image",
      "url": "https://example.com/article",
      "width": 1920
    }
  ]
}`))
	if err != nil {
		t.Fatalf("parseDDGImageResults returned error: %v", err)
	}

	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}

	result := results[0]
	if result.URL != "https://example.com/article" {
		t.Errorf("expected page URL, got %q", result.URL)
	}
	if result.Image != "https://example.com/image.jpg" {
		t.Errorf("expected image URL, got %q", result.Image)
	}
	if result.Thumb != "https://example.com/thumb.jpg" {
		t.Errorf("expected thumbnail URL, got %q", result.Thumb)
	}
	if result.Domain != "example.com" {
		t.Errorf("expected domain, got %q", result.Domain)
	}
	if result.Desc != "1920 x 1080" {
		t.Errorf("expected dimensions description, got %q", result.Desc)
	}
}
