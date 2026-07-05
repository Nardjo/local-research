package server

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealthHandler(t *testing.T) {
	r := httptest.NewRequest(http.MethodGet, "/health", http.NoBody)
	w := httptest.NewRecorder()

	HealthHandler(w, r)

	if w.Code != http.StatusNoContent {
		t.Errorf("HealthHandler returned wrong status code: got %v, expected %v", w.Code, http.StatusNoContent)
	}
}
