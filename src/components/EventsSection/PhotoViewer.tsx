import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { CommunityEvent } from "@/lib/events";
import { getFocusableElements, trapFocusInModal } from "@/lib/focus-trap";

interface PhotoViewerProps {
  event: CommunityEvent;
  startIndex: number;
  onClose: () => void;
}

/**
 * Alt text a post can leave out. Without it a photo button would have no name
 * at all, so it says at least which photo of which event this is.
 */
export function photoAlt(event: CommunityEvent, index: number): string {
  return (
    event.photos[index]?.alt ||
    `Photo ${index + 1} of ${event.photos.length} from ${event.title}`
  );
}

/**
 * One event's photos, full screen, one at a time.
 *
 * Mounted only while open, so it owns everything an open dialog needs: focus
 * moves to the close button on the way in and back to whatever opened it on
 * the way out, Tab stays inside, the page behind stops scrolling, and Escape
 * and the arrow keys work from anywhere in it. Drawn as the TSC profile is — a
 * fixed backdrop rather than a native `<dialog>` — so the two behave alike.
 */
export default function PhotoViewer({
  event,
  startIndex,
  onClose,
}: PhotoViewerProps) {
  const [index, setIndex] = useState(startIndex);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const count = event.photos.length;
  const photo = event.photos[index];

  const showPrevious = () => setIndex(current => (current - 1 + count) % count);
  const showNext = () => setIndex(current => (current + 1) % count);

  /* Once per opening: the opener is whatever had focus before this mounted. */
  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") {
        onClose();
      } else if (keyEvent.key === "ArrowLeft" && count > 1) {
        setIndex(current => (current - 1 + count) % count);
      } else if (keyEvent.key === "ArrowRight" && count > 1) {
        setIndex(current => (current + 1) % count);
      } else if (keyEvent.key === "Tab") {
        trapFocusInModal(keyEvent, getFocusableElements(viewerRef.current));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count, onClose]);

  if (!photo) return null;

  return (
    <div className="events-viewer-backdrop" onClick={onClose}>
      <div
        ref={viewerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="events-viewer-title"
        className="events-viewer"
        onClick={clickEvent => clickEvent.stopPropagation()}>
        <header className="events-viewer-header">
          <div>
            <p className="events-viewer-position" aria-hidden="true">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </p>
            <h2 id="events-viewer-title" className="events-viewer-title">
              {event.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="events-viewer-close"
            aria-label="Close photo viewer">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <figure className="events-viewer-stage">
          <Image
            src={photo.src}
            alt={photoAlt(event, index)}
            width={1600}
            height={1200}
            sizes="(min-width: 1152px) 72rem, 100vw"
            className="events-viewer-photo"
          />
        </figure>

        {count > 1 ? (
          <div className="events-viewer-controls">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous photo"
              className="events-viewer-control">
              <span aria-hidden="true">←</span>
              <span>Previous</span>
            </button>

            {/* The counter above is the sighted read-out; this is what a
                keyboard user hears after Previous or Next. */}
            <p className="sr-only" role="status" aria-live="polite">
              Photo {index + 1} of {count}
            </p>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next photo"
              className="events-viewer-control">
              <span>Next</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
