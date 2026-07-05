package server

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSearchHandler(t *testing.T) {
	tests := []struct {
		q        string
		wantCode int
	}{
		{"!g+google", http.StatusFound},
		{"!c+danser", http.StatusFound},
		{"!ia", http.StatusOK},
		{"Ma+recherche", http.StatusOK},
	}

	for _, tt := range tests {
		url := fmt.Sprintf("/search?q=%s", tt.q)
		t.Run(fmt.Sprintf("with url %s", url), func(t *testing.T) {
			r := httptest.NewRequest(http.MethodGet, url, http.NoBody)
			w := httptest.NewRecorder()
			SearchHandler(w, r)
			if tt.wantCode != w.Code {
				t.Errorf("Handler return wrong status code : got %v, expected %v", w.Code, tt.wantCode)
			}
		})
	}
}

func TestReplaceFilterBangs(t *testing.T) {
	tests := []struct {
		q    string
		want string
	}{
		{"!ia", "ia"},
		{"!ia assistant", "ia assistant"},
		{"assistant !ia", "assistant ia"},
		{"!r golang", "site:reddit.com golang"},
	}

	for _, tt := range tests {
		t.Run(tt.q, func(t *testing.T) {
			got := ReplaceFilterBangs(tt.q)
			if got != tt.want {
				t.Errorf("ReplaceFilterBangs() = %q, want %q", got, tt.want)
			}
		})
	}
}
