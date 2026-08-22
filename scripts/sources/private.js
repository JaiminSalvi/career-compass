// Private-job provider interface.
// Do not scrape providers that require login or prohibit automated collection.
// Add legitimate public APIs, RSS feeds, or explicit company career feeds here.
export async function fetchPrivateSources() {
  return [];
}