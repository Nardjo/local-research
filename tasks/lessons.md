# Lessons

- When a bang is meant to trigger Local Research itself, keep it out of external redirect bangs and cover the behavior with a server regression test.
- When moving an existing bang off a reserved query, preserve the original destination under the requested replacement bang instead of deleting the shortcut.
- When the browser/search provider already includes a shortcut, avoid duplicating it in Local Research unless the user explicitly wants a local override.
