import trackedRepositories from "@/data/tracked_repositories.json";

/**
 * The repositories the Issue Explorer covers, and how they are turned into
 * GitHub search queries.
 *
 * The board is scoped to the SDKs. They are where a contributor arriving from
 * this page can realistically start — one repository per language, each with a
 * few dozen open issues — whereas the organisation as a whole carries a couple
 * of thousand, most of them deep in the consensus node.
 */

export const ORGANIZATION = trackedRepositories.organization;

/**
 * Derived from the tracked list by name rather than written out again, so the
 * board and the repository grid on the home page can never drift apart. A new
 * `hiero-sdk-*` repository joins the board on the next build; `governance` and
 * `sdk-collaboration-hub` are coordination repositories, not SDKs, and the
 * prefix leaves them out.
 */
const SDK_PREFIX = "hiero-sdk-";

export const SDK_REPOSITORIES: string[] = trackedRepositories.repositories
  .map(repository => repository.name)
  .filter(name => name.startsWith(SDK_PREFIX))
  .sort((a, b) => a.localeCompare(b));

/**
 * GitHub rejects a search query over this length outright — with a 422, so a
 * query that grows past it fails the whole board rather than degrading.
 */
export const MAX_QUERY_LENGTH = 256;

/** What makes an issue available for someone to pick up. */
export const BASE_QUERY = "is:issue state:open archived:false no:assignee";

/**
 * The repository filter has to be an `OR` chain: unlike `label:`, the `repo:`
 * qualifier has no comma form — `repo:a,b` comes back as a validation error.
 * Eight of them is 390 characters, well over the limit, so the list is split
 * into as many queries as it takes to stay under it.
 *
 * Two, at the time of writing, which is also two requests per refresh. Adding
 * a ninth SDK costs nothing here; adding a tenth may cost one more request,
 * and that is the whole consequence.
 */
export function buildRepositoryQueries(
  repositories: string[] = SDK_REPOSITORIES,
): string[] {
  const queries: string[] = [];
  let group: string[] = [];

  const render = (names: string[]) =>
    `${BASE_QUERY} (${names
      .map(name => `repo:${ORGANIZATION}/${name}`)
      .join(" OR ")})`;

  for (const name of repositories) {
    const candidate = [...group, name];

    if (group.length > 0 && render(candidate).length > MAX_QUERY_LENGTH) {
      queries.push(render(group));
      group = [name];
      continue;
    }

    group = candidate;
  }

  if (group.length > 0) queries.push(render(group));

  return queries;
}
