"use client";

import { useId, useMemo, useRef, useState, useSyncExternalStore } from "react";

import {
  DIFFICULTIES,
  classifyDifficulty,
  difficultyLabel,
} from "@/issues/difficulty";
import {
  EMPTY_QUERY,
  SORT_OPTIONS,
  countByDifficulty,
  filterIssues,
  isDefaultQuery,
  paramsFromQuery,
  queryFromParams,
  type IssueQuery,
  type SortValue,
} from "@/issues/filter";
import {
  issueUrl,
  type ExplorerData,
  type ExplorerIssue,
} from "@/issues/types";
import GossipField from "@/components/GossipField";
import { formatAge } from "@/lib/dates";

/**
 * Twelve, so a page is a whole number of rows at one, two and three columns —
 * no orphan on the last row at any breakpoint the grid uses.
 */
const PER_PAGE = 12;
const PAGER_SIZE = 5;

/** Three is enough to place an issue; a card with nine chips is a wall. */
const VISIBLE_LABELS = 3;

/**
 * The query string, as a store the board subscribes to.
 *
 * Filter state lives in the URL so a filtered board can be shared — "the good
 * first issues in hiero-sdk-python" is a thing people paste into Discord — and
 * this is what makes the URL readable without making the page dynamic. The
 * server snapshot is empty, so the HTML every visitor gets from the CDN is the
 * unfiltered board; a visitor who arrived on a filtered link gets their filter
 * applied on the render straight after hydration.
 */
const locationListeners = new Set<() => void>();

function subscribeToLocation(listener: () => void): () => void {
  locationListeners.add(listener);
  window.addEventListener("popstate", listener);

  return () => {
    locationListeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

function readLocationSearch(): string {
  return window.location.search;
}

/* A constant, so hydration has something stable to compare against. */
const NO_SEARCH = "";

function readServerSearch(): string {
  return NO_SEARCH;
}

/**
 * `history.replaceState` rather than the router: this is the same document
 * showing a different view of an array already in memory, so there is nothing
 * for Next to fetch and `router.replace` would ask the server anyway. Replace
 * rather than push, so the back button leaves the page instead of walking back
 * through every keystroke — which also means nothing else emits `popstate`,
 * hence the manual notification.
 */
function writeLocationSearch(search: string): void {
  window.history.replaceState(
    null,
    "",
    search === "" ? window.location.pathname : `?${search}`,
  );

  for (const listener of locationListeners) listener();
}

interface IssueExplorerProps {
  data: ExplorerData;
  organization: string;
}

export default function IssueExplorer({
  data,
  organization,
}: IssueExplorerProps) {
  const search = useSyncExternalStore(
    subscribeToLocation,
    readLocationSearch,
    readServerSearch,
  );

  const query = useMemo(
    () => queryFromParams(new URLSearchParams(search)),
    [search],
  );

  const [page, setPage] = useState(1);
  const boardRef = useRef<HTMLDivElement>(null);
  const searchId = useId();
  const repoId = useId();
  const sortId = useId();

  function update(patch: Partial<IssueQuery>) {
    writeLocationSearch(paramsFromQuery({ ...query, ...patch }));
    setPage(1);
  }

  /* Difficulty counts have to answer "how many would I get if I clicked this",
     so they are taken after the other filters and before this one. */
  const withoutDifficulty = useMemo(
    () => filterIssues(data.issues, { ...query, difficulty: null }),
    [data.issues, query],
  );

  const counts = useMemo(
    () => countByDifficulty(withoutDifficulty),
    [withoutDifficulty],
  );

  const matches = useMemo(
    () =>
      query.difficulty === null
        ? withoutDifficulty
        : withoutDifficulty.filter(
            issue => issue.difficulty === query.difficulty,
          ),
    [withoutDifficulty, query.difficulty],
  );

  const totalPages = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  /* A filter can shrink the result set under the current page while the reader
     is on it; clamping here rather than resetting keeps deep pages reachable. */
  const currentPage = Math.min(page, totalPages);
  const firstIndex = (currentPage - 1) * PER_PAGE;
  const pageIssues = matches.slice(firstIndex, firstIndex + PER_PAGE);

  function goTo(next: number) {
    setPage(next);
    boardRef.current?.scrollIntoView({ block: "start" });
  }

  const filtered = !isDefaultQuery(query);

  return (
    <section
      id="board"
      aria-labelledby="open-issues-heading"
      className="issues-board">
      <GossipField placement="board" />

      <div ref={boardRef} className="container issues-board-inner">
        <h2 id="open-issues-heading" className="sr-only">
          Open issues
        </h2>

        <div className="issues-toolbar">
          <div className="issues-search">
            <label htmlFor={searchId} className="sr-only">
              Search issues by title, repository or label
            </label>

            <span className="issues-search-glyph" aria-hidden="true">
              ⌕
            </span>

            <input
              id={searchId}
              type="search"
              value={query.search}
              placeholder="Search titles, repositories, labels…"
              autoComplete="off"
              className="issues-search-input"
              onChange={event => update({ search: event.target.value })}
            />
          </div>

          <div className="issues-toolbar-fields">
            <div className="issues-field">
              <label htmlFor={repoId} className="issues-field-label">
                Repository
              </label>

              <span className="issues-select-shell">
                <select
                  id={repoId}
                  value={query.repo ?? ""}
                  className="issues-select"
                  onChange={event =>
                    update({ repo: event.target.value || null })
                  }>
                  <option value="">All repositories</option>
                  {data.repos.map(repo => (
                    <option key={repo} value={repo}>
                      {repo}
                    </option>
                  ))}
                </select>

                <span className="issues-select-glyph" aria-hidden="true">
                  ▾
                </span>
              </span>
            </div>

            <div className="issues-field">
              <label htmlFor={sortId} className="issues-field-label">
                Sort
              </label>

              <span className="issues-select-shell">
                <select
                  id={sortId}
                  value={query.sort}
                  className="issues-select"
                  onChange={event =>
                    update({ sort: event.target.value as SortValue })
                  }>
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <span className="issues-select-glyph" aria-hidden="true">
                  ▾
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          className="issues-levels"
          role="group"
          aria-label="Filter by difficulty">
          <LevelChip
            label="Everything"
            count={withoutDifficulty.length}
            active={query.difficulty === null}
            onSelect={() => update({ difficulty: null })}
          />

          {DIFFICULTIES.map(difficulty => (
            <LevelChip
              key={difficulty.value}
              label={difficulty.label}
              count={counts.get(difficulty.value) ?? 0}
              active={query.difficulty === difficulty.value}
              onSelect={() => update({ difficulty: difficulty.value })}
            />
          ))}
        </div>

        <div className="issues-tally">
          <p className="issues-tally-count">
            {matches.length === 0
              ? "No matching issues"
              : `${matches.length.toLocaleString("en-GB")} ${
                  matches.length === 1 ? "issue" : "issues"
                }`}
            {totalPages > 1 && (
              <span>
                {" "}
                · page {currentPage} of {totalPages}
              </span>
            )}
          </p>

          {filtered && (
            <button
              type="button"
              className="issues-reset"
              onClick={() => update(EMPTY_QUERY)}>
              Clear filters
            </button>
          )}
        </div>

        {/* Announced rather than shown: the count above is already visible, and
            a filter that silently reorders the page under a screen reader is
            the change nobody hears. */}
        <p role="status" aria-live="polite" className="sr-only">
          {matches.length} {matches.length === 1 ? "issue" : "issues"} match
          {matches.length === 1 ? "es" : ""} the current filters.
        </p>

        {pageIssues.length === 0 ? (
          /* Two different nothings. An empty board is GitHub not answering,
             and telling that reader to broaden their search sends them looking
             for a mistake they did not make. */
          <div className="issues-empty">
            <p className="issues-empty-title">
              {data.issues.length === 0
                ? "The board could not be loaded"
                : "Nothing matches those filters"}
            </p>
            <p className="issues-empty-copy">
              {data.issues.length === 0
                ? "GitHub did not answer when this page was last built. It is retried automatically, so a refresh in a few minutes will usually have it back — and every open issue is always on GitHub itself."
                : "Try a broader search, or clear the filters to see everything on the board."}
            </p>

            {filtered && (
              <button
                type="button"
                className="issues-empty-action"
                onClick={() => update(EMPTY_QUERY)}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <ul role="list" className="issues-grid">
            {pageIssues.map(issue => (
              <li key={issue.id} className="issues-grid-item">
                <IssueCard
                  issue={issue}
                  organization={organization}
                  reference={data.fetchedAt}
                />
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onSelect={goTo}
          />
        )}
      </div>
    </section>
  );
}

function LevelChip({
  label,
  count,
  active,
  onSelect,
}: {
  label: string;
  count: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      /* The two spans are inline, so the name algorithm runs them together as
         "Beginner12" without this. */
      aria-label={`${label}, ${count} ${count === 1 ? "issue" : "issues"}`}
      /* Not disabled at zero: a level with nothing in it is information, and a
         disabled control is unreachable by keyboard and unexplained. */
      className="issues-level"
      onClick={onSelect}>
      <span>{label}</span>
      <span className="issues-level-count">{count}</span>
    </button>
  );
}

function IssueCard({
  issue,
  organization,
  reference,
}: {
  issue: ExplorerIssue;
  organization: string;
  reference: string;
}) {
  /* The level badge already carries what one of these labels says, so it is
     dropped from the row rather than shown twice. */
  const rest = issue.labels.filter(
    label => classifyDifficulty([label]) === null,
  );

  const chips = rest.slice(0, VISIBLE_LABELS);
  const hidden = rest.length - chips.length;

  return (
    <a
      href={issueUrl(organization, issue)}
      target="_blank"
      rel="noopener noreferrer"
      /* The level goes in the name too. It is the card's most useful fact and
         it is the reader's own filter answering back, and an explicit name on
         the anchor means nothing inside it is read otherwise. */
      aria-label={
        `${issue.title} — issue ${issue.number} in ${issue.repo}` +
        `${issue.difficulty === null ? "" : `, ${difficultyLabel(issue.difficulty)}`}` +
        " (opens in a new tab)"
      }
      className="issues-card">
      <span className="issues-card-head">
        <span className="issues-card-repo">{issue.repo}</span>

        {issue.difficulty !== null && (
          <span className="issues-card-level" data-level={issue.difficulty}>
            {difficultyLabel(issue.difficulty)}
          </span>
        )}
      </span>

      {/* Plain text, deliberately. `title` is whatever an issue author typed,
          and anyone can open an issue on a tracked repository. Rendered as
          markdown, that author could put an `<a>` inside this card's own
          anchor — invalid, and it closes the outer link early — or an `<img>`,
          which would make every visitor fetch from a host they chose. GitHub
          shows issue titles as plain text for the same reason. */}
      <span className="issues-card-title">{issue.title}</span>

      {chips.length > 0 && (
        <span className="issues-card-labels">
          {chips.map(label => (
            <span key={label} className="issues-card-label">
              {label}
            </span>
          ))}

          {hidden > 0 && (
            <span className="issues-card-label issues-card-label--more">
              +{hidden}
            </span>
          )}
        </span>
      )}

      <span className="issues-card-foot">
        <span className="issues-card-meta">
          <span>#{issue.number}</span>
          <span>{formatAge(issue.createdAt, reference)}</span>
          {issue.comments > 0 && (
            <span>
              {issue.comments} {issue.comments === 1 ? "comment" : "comments"}
            </span>
          )}
        </span>

        <span className="issues-card-glyph" aria-hidden="true">
          ↗
        </span>
      </span>
    </a>
  );
}

/**
 * The archive pager, with the same shape and the same keys — see
 * `components/BlogPostList`. The two share their rules in `globals.css` rather
 * than their markup, because the blog paginates a server-rendered list and this
 * paginates an array in memory.
 */
function Pagination({
  page,
  totalPages,
  onSelect,
}: {
  page: number;
  totalPages: number;
  onSelect: (page: number) => void;
}) {
  const half = Math.floor(PAGER_SIZE / 2);
  const rawStart = Math.max(1, page - half);
  const windowEnd = Math.min(totalPages, rawStart + PAGER_SIZE - 1);
  const windowStart = Math.max(1, windowEnd - PAGER_SIZE + 1);
  const visiblePages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, index) => windowStart + index,
  );

  return (
    <nav className="issues-pagination" aria-label="Board pages">
      <ul role="list" className="issues-pagination-list">
        <PagerStep
          label="Previous page"
          glyph="←"
          disabled={page === 1}
          onSelect={() => onSelect(page - 1)}
        />

        {visiblePages.map(candidate => (
          <li key={candidate} className="issues-pagination-item">
            <button
              type="button"
              disabled={candidate === page}
              aria-current={candidate === page ? "page" : undefined}
              aria-label={`Page ${candidate}`}
              className="issues-pagination-link"
              onClick={() => onSelect(candidate)}>
              {candidate}
            </button>
          </li>
        ))}

        <PagerStep
          label="Next page"
          glyph="→"
          disabled={page === totalPages}
          onSelect={() => onSelect(page + 1)}
        />
      </ul>
    </nav>
  );
}

function PagerStep({
  label,
  glyph,
  disabled,
  onSelect,
}: {
  label: string;
  glyph: string;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="issues-pagination-item">
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        className="issues-pagination-link issues-pagination-link--step"
        onClick={() => {
          if (!disabled) onSelect();
        }}>
        <span aria-hidden="true">{glyph}</span>
      </button>
    </li>
  );
}
