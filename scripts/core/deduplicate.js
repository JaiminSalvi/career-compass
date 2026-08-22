export function deduplicate(items) {
  const seen = new Map();
  for (const item of items) {
    const key = `${item.organization}|${item.title}|${item.applicationUrl || ""}|${item.applicationDeadline || ""}`.toLowerCase();
    const old = seen.get(key);
    if (!old || (item.applicationUrl && !old.applicationUrl)) seen.set(key, item);
  }
  return [...seen.values()];
}