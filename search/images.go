package search

import (
	"encoding/json"
	"fmt"
	"io"
	"local-research/utils"
	"net/url"
	"regexp"
)

var ddgImageVQDPattern = regexp.MustCompile(`vqd=["']([^"']+)["']`)

type ddgImageResponse struct {
	Results []ddgImageResult `json:"results"`
}

type ddgImageResult struct {
	Height    int    `json:"height"`
	Image     string `json:"image"`
	Thumbnail string `json:"thumbnail"`
	Title     string `json:"title"`
	URL       string `json:"url"`
	Width     int    `json:"width"`
}

func GetDDGImageResults(q string) ([]SearchResult, error) {
	searchURL := fmt.Sprintf("https://duckduckgo.com/?q=%s&iax=images&ia=images", url.QueryEscape(q))
	res, err := utils.Fetch(searchURL)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	vqd, ok := extractDDGImageVQD(string(body))
	if !ok {
		return []SearchResult{}, nil
	}

	imagesURL := fmt.Sprintf(
		"https://duckduckgo.com/i.js?l=fr-fr&o=json&q=%s&vqd=%s&f=,,,&p=1",
		url.QueryEscape(q),
		url.QueryEscape(vqd),
	)
	imageRes, err := utils.Fetch(imagesURL)
	if err != nil {
		return nil, err
	}
	defer imageRes.Body.Close()

	imageBody, err := io.ReadAll(imageRes.Body)
	if err != nil {
		return nil, err
	}

	return parseDDGImageResults(imageBody)
}

func extractDDGImageVQD(html string) (string, bool) {
	matches := ddgImageVQDPattern.FindStringSubmatch(html)
	if len(matches) != 2 {
		return "", false
	}
	return matches[1], true
}

func parseDDGImageResults(body []byte) ([]SearchResult, error) {
	var response ddgImageResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}

	results := []SearchResult{}
	for _, item := range response.Results {
		if item.Image == "" || item.URL == "" {
			continue
		}

		pageURL, err := url.Parse(item.URL)
		if err != nil || pageURL.Host == "" || isBlockedSite(pageURL.Host) {
			continue
		}

		results = append(results, SearchResult{
			URL:    item.URL,
			Title:  item.Title,
			Desc:   fmt.Sprintf("%d x %d", item.Width, item.Height),
			Domain: pageURL.Host,
			Image:  item.Image,
			Thumb:  item.Thumbnail,
			Width:  item.Width,
			Height: item.Height,
		})
	}

	return results, nil
}
