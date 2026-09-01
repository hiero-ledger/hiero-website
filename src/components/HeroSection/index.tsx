import Link from "next/link";
import HieroMarkScene from "./HieroMarkScene";
import HeroTraces from "./HeroTraces";
import {
  isExternalLink,
  opensInNewTab,
  withNewTabHint,
  type MenuItem,
} from "@/data/navigation";

type HeroFact = {
  value: string;
  label: string;
};

type HeroData = {
  eyebrow: string;
  heading: string;
  lede: string;
  actions: MenuItem[];
  facts: HeroFact[];
};

type HeroSectionProps = {
  data: HeroData;
};

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

        <HieroMarkScene />

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
