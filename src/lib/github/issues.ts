export async function searchIssues(query: string) {
  const res = await fetch(`https://api.github.com/search/issues?q=${query}`);

  if (!res.ok) {
    throw new Error("GitHub API failed");
  }

  return res.json(); // raw
}
