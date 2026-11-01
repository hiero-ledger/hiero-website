/**
 * Keyboard containment for the site's dialogs — the TSC member profile and the
 * events photo viewer. Both are drawn as a fixed backdrop over the page rather
 * than a native `<dialog>`, so Tab has to be kept inside them by hand.
 */

export function getFocusableElements(
  container: HTMLElement | null,
): HTMLElement[] {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    element =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true",
  );
}

export function trapFocusInModal(
  event: KeyboardEvent,
  focusableElements: HTMLElement[],
): void {
  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }
}
