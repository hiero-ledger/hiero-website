export async function searchIssues(query: string): Promise<unknown> {
  const res = await fetch(`https://api.github.com/search/issues?q=${query}`);
  return res.json();
}
