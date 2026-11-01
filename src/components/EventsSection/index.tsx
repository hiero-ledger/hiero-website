"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import RichText from "@/components/RichText";
import { formatPostDateShort } from "@/lib/dates";
import type { CommunityEvent } from "@/lib/events";
import PhotoViewer, { photoAlt } from "./PhotoViewer";

interface EventsData {
  eyebrow: string;
  heading: string;
  text: string;
  /** Closing line inviting readers to add their own event. */
  footer: string;
}

interface EventsSectionProps {
  data: EventsData;
  events: CommunityEvent[];
}

/** Photos the featured mosaic shows before the rest go behind a "+N". */
export const MOSAIC_COUNT = 3;

/** Events listed under the featured one: one row of the three-column grid. */
export const MORE_EVENTS_COUNT = 3;

interface OpenGallery {
  event: CommunityEvent;
  index: number;
}

/**
 * The home page's events band: the newest event large, with its photos as a
 * mosaic, and the next few as cards below. Everything in it comes from blog
 * posts that carry an `[event]` table, so a recap shows up here by being
 * published, with no second list to keep in step.
 *
 * Photos open in a viewer rather than linking to the files, which is the one
 * piece of state here and the reason this is a client component.
 *
 * No gossip field behind this band, for the reason the TSC committee holds
 * its own back: a web drawn behind photographs reads as dirt on them.
 */
export default function EventsSection({ data, events }: EventsSectionProps) {
  const [gallery, setGallery] = useState<OpenGallery | null>(null);
  const [featured, ...rest] = events;

  if (!featured) return null;

  const more = rest.slice(0, MORE_EVENTS_COUNT);
  const open = (event: CommunityEvent, index: number) =>
    setGallery({ event, index });

  return (
    <>
      <section id="events" aria-labelledby="events-heading" className="events">
        <div className="container events-inner">
          <header className="events-header">
            <div>
              <p className="events-eyebrow">{data.eyebrow}</p>
              <h2 id="events-heading" className="events-heading">
                {data.heading}
              </h2>
            </div>

            <div className="events-intro">
              <RichText markdown={data.text} className="events-copy" />
            </div>
          </header>

          <article
            className="events-feature"
            aria-labelledby="events-feature-title">
            <EventMosaic event={featured} onOpen={open} />

            <div className="events-feature-body">
              <EventMeta event={featured} />

              <h3 id="events-feature-title" className="events-feature-title">
                {featured.title}
              </h3>

              {featured.abstract ? (
                <p className="events-feature-abstract">{featured.abstract}</p>
              ) : null}

              <div className="events-feature-actions">
                <Link
                  href={`/blog/${featured.slug}`}
                  aria-label={`${readLabel(featured)}: ${featured.title}`}
                  className="events-feature-link">
                  <span>{readLabel(featured)}</span>
                  <span aria-hidden="true">→</span>
                </Link>

                {featured.photos.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => open(featured, 0)}
                    aria-haspopup="dialog"
                    className="events-photos-button">
                    View all {featured.photos.length} photos
                  </button>
                ) : null}
              </div>
            </div>
          </article>

          {more.length > 0 ? (
            <>
              <div className="events-board-heading" aria-hidden="true">
                <span>More events</span>
                <span>Recaps on the blog</span>
              </div>

              <ul role="list" className="events-grid">
                {more.map(event => (
                  <li key={event.slug} className="events-card">
                    <EventCardPlate event={event} onOpen={open} />

                    {/* `aria-label` for the reason the blog cards carry one:
                        the link wraps meta, title and action, and without it
                        the name is all of them run together. */}
                    <Link
                      href={`/blog/${event.slug}`}
                      aria-label={event.title}
                      className="events-card-body">
                      <EventMeta event={event} />
                      <h3 className="events-card-title">{event.title}</h3>
                      <span className="events-card-action" aria-hidden="true">
                        <span>{readLabel(event)}</span>
                        <span className="events-card-action-glyph">→</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <RichText markdown={data.footer} className="events-footer" />
        </div>
      </section>

      {gallery ? (
        <PhotoViewer
          event={gallery.event}
          startIndex={gallery.index}
          onClose={() => setGallery(null)}
        />
      ) : null}
    </>
  );
}

function readLabel(event: CommunityEvent): string {
  return event.upcoming ? "Read the announcement" : "Read the recap";
}

/* Spans rather than a paragraph: the cards put this inside a link. */
function EventMeta({ event }: { event: CommunityEvent }) {
  return (
    <span className="events-meta">
      {event.upcoming ? (
        <span className="events-meta-tag">Upcoming</span>
      ) : null}
      <time dateTime={event.date}>{formatPostDateShort(event.date)}</time>
      {event.location ? (
        <span className="events-meta-location">{event.location}</span>
      ) : null}
    </span>
  );
}

interface GalleryTriggerProps {
  event: CommunityEvent;
  onOpen: (event: CommunityEvent, index: number) => void;
}

/**
 * The featured event's first few photos, each a way into the viewer at that
 * photo. An event without photos still gets the plate, with its post's
 * featured image, so the band keeps its shape.
 */
function EventMosaic({ event, onOpen }: GalleryTriggerProps) {
  if (event.photos.length === 0) {
    return (
      <div className="events-mosaic" data-count="1">
        <span className="events-tile">
          <Image
            src={event.cover}
            alt=""
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="events-tile-image"
          />
        </span>
      </div>
    );
  }

  const shown = event.photos.slice(0, MOSAIC_COUNT);
  const hidden = event.photos.length - shown.length;

  return (
    <div className="events-mosaic" data-count={shown.length}>
      {shown.map((photo, index) => (
        <button
          key={photo.src}
          type="button"
          onClick={() => onOpen(event, index)}
          aria-haspopup="dialog"
          className="events-tile">
          <Image
            src={photo.src}
            alt={photoAlt(event, index)}
            width={1600}
            height={1200}
            sizes={
              index === 0
                ? "(min-width: 1024px) 40vw, 66vw"
                : "(min-width: 1024px) 20vw, 33vw"
            }
            className="events-tile-image"
          />
          {/* The "View all" button says the count in words; this is its
              sighted shorthand on the photo itself. */}
          {hidden > 0 && index === shown.length - 1 ? (
            <span className="events-tile-more" aria-hidden="true">
              +{hidden}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

/**
 * A card's picture. With photos it opens the viewer and says how many there
 * are; without, it is only the post's featured image. A sibling of the card's
 * link rather than inside it, since a button cannot sit in a link.
 */
function EventCardPlate({ event, onOpen }: GalleryTriggerProps) {
  const image = (
    <Image
      src={event.cover}
      alt=""
      width={720}
      height={405}
      sizes="(min-width: 1280px) 24rem, (min-width: 768px) 30vw, 100vw"
      className="events-card-image"
    />
  );

  if (event.photos.length === 0) {
    return <span className="events-card-plate">{image}</span>;
  }

  const count = event.photos.length;
  const label = count === 1 ? "1 photo" : `${count} photos`;

  return (
    <button
      type="button"
      onClick={() => onOpen(event, 0)}
      aria-haspopup="dialog"
      aria-label={`View ${label} from ${event.title}`}
      className="events-card-plate">
      {image}
      <span className="events-card-count" aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
