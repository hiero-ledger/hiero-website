import Link from "next/link";
import ConsensusLattice from "./ConsensusLattice";
import HeroTraces from "./HeroTraces";
import {
  isExternalLink,
  opensInNewTab,
  withNewTabHint,
  type MenuItem,
} from "@/data/navigation";

/**
 * One number the project can prove, plus what it counts. Values arrive
 * pre-formatted from `src/data/homePageData.ts` so the hero never has to know
 * where the counts come from or how they are punctuated.
 */
type HeroFact = {
  value: string;
  label: string;
};

type HeroData = {
  eyebrow: string;
  heading: string;
  lede: string;
  /**
   * The first action is the primary one and is rendered solid; the rest are
   * outlined. Two is the intended maximum — a hero with three equal doors
   * gives the reader nothing to follow.
   */
  actions: MenuItem[];
  facts: HeroFact[];
};

type HeroSectionProps = {
  data: HeroData;
};

/**
 * Reuses the menu's link helpers rather than its own external-link test, so a
 * hero button and a nav item treat `external`/`newTab` the same way and carry
 * the same new-tab hint for screen readers.
 */
function HeroAction({
  action,
  primary,
}: {
  action: MenuItem;
  primary: boolean;
}) {
  const className = `hero-section-action ${
    primary ? "hero-section-action--primary" : "hero-section-action--ghost"
  }`;

  if (!isExternalLink(action)) {
    return (
      <Link href={action.href} className={className}>
        {action.name}
      </Link>
    );
  }

  const newTab = opensInNewTab(action);

  return (
    <a
      href={action.href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      aria-label={newTab ? withNewTabHint(action.name) : undefined}
      className={className}>
      {action.name}
      {newTab && (
        <span className="hero-section-action-glyph" aria-hidden="true">
          ↗
        </span>
      )}
    </a>
  );
}

export default function HeroSection({ data }: HeroSectionProps) {
  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-title">
      <HeroTraces />

      <div className="container hero-section-inner">
        <p className="hero-section-eyebrow">{data.eyebrow}</p>

        <ConsensusLattice />

        <div className="hero-section-lockup">
          <h1 id="hero-title" className="hero-section-title">
            {data.heading}
          </h1>

          <div className="hero-section-pitch">
            <p className="hero-section-lede">{data.lede}</p>

            <div className="hero-section-actions">
              {data.actions.map((action, index) => (
                <HeroAction
                  key={action.name}
                  action={action}
                  primary={index === 0}
                />
              ))}
            </div>
          </div>
        </div>

        <ul role="list" className="hero-section-colophon">
          {data.facts.map(fact => (
            <li key={fact.label} className="hero-section-fact">
              <span className="hero-section-fact-value">{fact.value}</span>{" "}
              {fact.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
