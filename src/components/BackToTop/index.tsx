"use client";

export default function BackToTop() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        const prefersReducedMotion =
          typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });

        // Scrolling alone leaves keyboard focus in the footer, so the next Tab
        // would jump back down the page. Hand focus to the first control in the
        // header instead, without fighting the scroll that is already running.
        document
          .querySelector<HTMLElement>("header a, header button")
          ?.focus({ preventScroll: true });
      }}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-charcoal/50 text-charcoal transition-colors duration-300 ease-in-out hover:border-red hover:bg-red hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-sand">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        focusable="false">
        <path
          d="M8 13.25V3.25M8 3.25L3.25 8M8 3.25L12.75 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
