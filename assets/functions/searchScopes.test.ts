import { describe, expect, it } from "vitest";
import {
  getSearchScope,
  getSearchScopeEndpoint,
  resolveSearchScope,
} from "./searchScopes.ts";

describe("search scopes", () => {
  it("defaults missing scopes to web search through DuckDuckGo", () => {
    expect(resolveSearchScope()).toBe("web");
    expect(getSearchScopeEndpoint("web")).toBe("/api/ddg");
  });

  it("falls back to web search for unknown scopes", () => {
    expect(resolveSearchScope("unknown")).toBe("web");
  });

  it("maps the videos scope to the existing YouTube endpoint", () => {
    expect(resolveSearchScope("videos")).toBe("videos");
    expect(getSearchScopeEndpoint("videos")).toBe("/api/youtube");
  });

  it("maps the images scope to the image search endpoint", () => {
    expect(resolveSearchScope("images")).toBe("images");
    expect(getSearchScopeEndpoint("images")).toBe("/api/images");
  });

  it("keeps old youtube engine URLs compatible", () => {
    expect(resolveSearchScope(undefined, "youtube")).toBe("videos");
  });

  it("prefers the explicit scope over legacy engine parameters", () => {
    expect(resolveSearchScope("web", "youtube")).toBe("web");
  });

  it("returns the full scope configuration for UI rendering", () => {
    expect(getSearchScope("videos")).toEqual({
      id: "videos",
      label: "Videos",
      endpoint: "/api/youtube",
    });
  });
});
