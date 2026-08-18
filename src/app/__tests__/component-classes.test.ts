import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Header and Menu keep their presentation in `globals.css` as component
 * classes, which buys readable multi-breakpoint CSS at one cost: the class
 * name is a bare string on both sides, so a typo renders unstyled rather than
 * failing loudly. Nothing in TypeScript or Tailwind catches it.
 *
 * This closes that gap. It deliberately covers only the prefixes that follow
 * the convention, so it does not object to ordinary Tailwind utilities.
 */
const PREFIXES = ["menu-", "site-header"];
const SRC = path.resolve(__dirname, "../..");
const CSS = path.resolve(__dirname, "../globals.css");

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(entry => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return tsxFiles(full);
    return full.endsWith(".tsx") ? [full] : [];
  });
}

const matches = (name: string) => PREFIXES.some(p => name.startsWith(p));

/** Class names the stylesheet actually defines a rule for. */
function definedClasses(): Set<string> {
  const css = readFileSync(CSS, "utf8");
  const found = new Set<string>();
  for (const [, name] of css.matchAll(/\.([a-z][a-z0-9-]*)\s*(?=[,{])/g)) {
    if (matches(name)) found.add(name);
  }
  return found;
}

/**
 * Class names the components put on an element.
 *
 * Scans raw source rather than trying to pick out class attributes: these are
 * routinely assembled in template literals with nested ternaries and quotes
 * (`` `menu-item ${x ? "menu-item--overlay-only" : ""}` ``), and any regex that
 * tries to parse that will report live classes as dead. Matching the prefixed
 * token anywhere in the file can only err toward calling something used, which
 * is the harmless direction.
 */
function usedClasses(): Map<string, string[]> {
  const used = new Map<string, string[]>();
  for (const file of tsxFiles(SRC)) {
    const source = readFileSync(file, "utf8");
    for (const [, name] of source.matchAll(/\b([a-z][a-z0-9-]*)\b/g)) {
      if (!matches(name)) continue;
      used.set(name, [...(used.get(name) ?? []), path.relative(SRC, file)]);
    }
  }
  return used;
}

describe("component class names", () => {
  const defined = definedClasses();
  const used = usedClasses();

  it("finds classes on both sides (guards against the regexes silently breaking)", () => {
    expect(defined.size).toBeGreaterThan(10);
    expect(used.size).toBeGreaterThan(10);
  });

  it("every class a component renders has a rule in globals.css", () => {
    const orphans = [...used.entries()]
      .filter(([name]) => !defined.has(name))
      .map(
        ([name, files]) =>
          `${name} (used in ${[...new Set(files)].join(", ")})`,
      );

    // A miss here means the element renders completely unstyled.
    expect(orphans, "class names with no rule in globals.css").toEqual([]);
  });

  it("every component class in globals.css is rendered by something", () => {
    const dead = [...defined].filter(name => !used.has(name)).sort();

    expect(dead, "rules in globals.css that nothing renders").toEqual([]);
  });
});
