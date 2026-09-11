"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import GossipField from "@/components/GossipField";

export interface TscMember {
  firstName: string;
  lastName: string;
  gitHubAccount?: string;
  photo?: string;
  bio?: string;
}

interface TscCommitteeProps {
  members: TscMember[];
}

/**
 * The committee band: a header in the site's usual shape, then one card per
 * member and the dialog a card opens.
 *
 * A client component because of that dialog — it is the only part of the TSC
 * page that has state — so the band's static half lives here with it rather
 * than being split across two files for the sake of a heading.
 */
export default function TscCommittee({ members }: TscCommitteeProps) {
  const [selectedMember, setSelectedMember] = useState<TscMember | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  /* The card that opened the dialog, so focus can go back to it on close. The
     element itself rather than its id: nothing else on the page needs these
     buttons to be addressable, and an id per member is a name to keep unique
     for no other reason. */
  const lastFocusedTriggerRef = useRef<HTMLButtonElement | null>(null);

  const sorted = [...members].sort((a, b) =>
    `${a.lastName} ${a.firstName}`.localeCompare(
      `${b.lastName} ${b.firstName}`,
    ),
  );

  useEffect(() => {
    if (!selectedMember) {
      return;
    }

    const focusCloseButton = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyboardInteraction = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedMember(null);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements(modalRef.current);

      trapFocusInModal(event, focusableElements);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyboardInteraction);

    return () => {
      window.clearTimeout(focusCloseButton);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyboardInteraction);

      lastFocusedTriggerRef.current?.focus();
    };
  }, [selectedMember]);

  return (
    <>
      <section
        aria-labelledby="tsc-committee-heading"
        className="tsc-committee">
        <GossipField placement="committee" />

        <div className="container tsc-committee-inner">
          <header className="tsc-committee-header">
            <div>
              <p className="tsc-committee-eyebrow">The committee</p>
              <h2 id="tsc-committee-heading" className="tsc-committee-heading">
                Who sits on the TSC
              </h2>
            </div>

            <div className="tsc-committee-intro">
              <p className="tsc-committee-copy">
                The committee is composed of contributors from across the Hiero
                ecosystem. Member bios reflect their current roles and ongoing
                work in open-source governance and technical delivery.
              </p>

              <p className="tsc-committee-count">
                {/* The count in the accessibility tree. It cannot ride on an
                    `aria-label` here: the implicit `paragraph` role prohibits an
                    author-provided name, so both visible spans are hidden and
                    the number is said once, in words. */}
                <span className="sr-only">
                  {sorted.length} members currently seated on the committee
                </span>
                <span className="tsc-committee-count-value" aria-hidden="true">
                  {String(sorted.length).padStart(2, "0")}
                </span>
                <span className="tsc-committee-count-label" aria-hidden="true">
                  members
                  <br />
                  currently seated
                </span>
              </p>
            </div>
          </header>

          <div className="tsc-committee-board-heading" aria-hidden="true">
            <span>Current members</span>
            <span>Listed by surname</span>
          </div>

          <ul role="list" className="tsc-committee-grid">
            {sorted.map((member, index) => {
              const fullName = `${member.firstName} ${member.lastName}`.trim();
              const hasBio = Boolean(member.bio?.trim());
              const githubHandle = getGitHubHandle(member.gitHubAccount);

              return (
                <li key={`${fullName}-${index}`} className="tsc-member">
                  <article className="tsc-member-card">
                    {member.photo ? (
                      <div className="tsc-member-plate">
                        <Image
                          src={`/images/tsc/${member.photo}`}
                          alt={`${fullName} profile photo for the Hiero Technical Steering Committee`}
                          width={320}
                          height={320}
                          className="tsc-member-photo"
                          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 40vw, 100vw"
                        />
                      </div>
                    ) : (
                      <div className="tsc-member-plate" aria-hidden="true">
                        <div className="tsc-member-photo tsc-member-photo--empty" />
                      </div>
                    )}

                    <div className="tsc-member-body">
                      <h3 className="tsc-member-name">{fullName}</h3>

                      {member.gitHubAccount ? (
                        <a
                          href={member.gitHubAccount}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="tsc-member-handle"
                          aria-label={`Visit ${fullName} on GitHub (opens in a new tab)`}>
                          <Image
                            src="/images/Hiero-Icon-Github.svg"
                            alt=""
                            width={16}
                            height={17}
                            className="tsc-member-handle-icon"
                          />
                          {githubHandle ?? "GitHub profile"}
                        </a>
                      ) : null}

                      <p className="tsc-member-bio">
                        {hasBio
                          ? getBioPreview(member.bio ?? "")
                          : "Biography not available."}
                      </p>

                      {hasBio ? (
                        <button
                          type="button"
                          onClick={event => {
                            lastFocusedTriggerRef.current = event.currentTarget;

                            setSelectedMember(member);
                          }}
                          className="tsc-member-action"
                          aria-label={`Read full profile for ${fullName}`}>
                          <span>Read full profile</span>
                          <span
                            className="tsc-member-action-glyph"
                            aria-hidden="true">
                            →
                          </span>
                        </button>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* A sibling of the band, not a child of it: `.tsc-committee` isolates
          itself so the gossip field behind it stays behind it, and a fixed
          dialog inside that stacking context would paint under the site
          header rather than over it. */}
      {selectedMember ? (
        <div
          className="tsc-profile-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tsc-profile-name"
          onClick={() => {
            setSelectedMember(null);
          }}>
          <div
            ref={modalRef}
            className="tsc-profile"
            onClick={event => {
              event.stopPropagation();
            }}>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                setSelectedMember(null);
              }}
              className="tsc-profile-close"
              aria-label="Close profile dialog">
              <span aria-hidden="true">×</span>
            </button>

            <div className="tsc-profile-body">
              <div className="tsc-profile-plate">
                {selectedMember.photo ? (
                  <Image
                    src={`/images/tsc/${selectedMember.photo}`}
                    alt={`${selectedMember.firstName} ${selectedMember.lastName} profile photo`}
                    width={320}
                    height={320}
                    className="tsc-profile-photo"
                  />
                ) : (
                  <div
                    className="tsc-profile-photo tsc-profile-photo--empty"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="tsc-profile-text">
                <p className="tsc-profile-eyebrow">Committee member</p>

                <h3 id="tsc-profile-name" className="tsc-profile-name">
                  {selectedMember.firstName} {selectedMember.lastName}
                </h3>

                {selectedMember.gitHubAccount ? (
                  <a
                    href={selectedMember.gitHubAccount}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tsc-member-handle"
                    aria-label={`Visit ${selectedMember.firstName} ${selectedMember.lastName} on GitHub (opens in a new tab)`}>
                    <Image
                      src="/images/Hiero-Icon-Github.svg"
                      alt=""
                      width={16}
                      height={17}
                      className="tsc-member-handle-icon"
                    />
                    {getGitHubHandle(selectedMember.gitHubAccount) ??
                      "GitHub profile"}
                  </a>
                ) : null}

                <div className="tsc-profile-bio">
                  {getBioParagraphs(
                    selectedMember.bio ?? "Biography not available.",
                  ).map((paragraph, index) => (
                    <p key={`${selectedMember.lastName}-${index}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function getBioPreview(bio: string, maxLength = 170): string {
  const trimmedBio = bio.trim();

  if (trimmedBio.length <= maxLength) {
    return trimmedBio;
  }

  return `${trimmedBio.slice(0, maxLength)}...`;
}

function getBioParagraphs(bio: string): string[] {
  const trimmedBio = bio.trim();

  if (!trimmedBio) {
    return [];
  }

  const explicitParagraphs = trimmedBio
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);

  if (explicitParagraphs.length > 1) {
    return explicitParagraphs;
  }

  const sentences = trimmedBio.split(/(?<=[.!?])\s+/).filter(Boolean);

  if (sentences.length <= 2) {
    return [trimmedBio];
  }

  const paragraphs: string[] = [];

  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(" "));
  }

  return paragraphs;
}

function getFocusableElements(container: HTMLDivElement | null): HTMLElement[] {
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

function trapFocusInModal(
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

function getGitHubHandle(gitHubAccount?: string): string | null {
  if (!gitHubAccount) {
    return null;
  }

  try {
    const url = new URL(gitHubAccount);
    const handle = url.pathname.split("/").filter(Boolean)[0];

    return handle ? `@${handle}` : null;
  } catch {
    return null;
  }
}
