export function nextTriviaHistory(items: readonly {id: string}[], seen: string[]): string[] {
 const currentId = seen[seen.length - 1];
 const recent = seen.length === items.length ? [] : seen;
 const remaining = items.filter(item => item.id !== currentId && !recent.includes(item.id));
 const next = remaining[Math.floor(Math.random() * remaining.length)];
 return next ? [...recent, next.id] : seen;
}
