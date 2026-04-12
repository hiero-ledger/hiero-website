"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import tscMembers from "@/data/technical_steering_committee.json";

interface Member {
  firstName: string;
  lastName: string;
  gitHubAccount?: string;
  photo?: string;
  bio?: string;
}

const TECHNICAL_CHARTER_URL =
  "https://github.com/hiero-ledger/governance/blob/main/hiero-technical-charter.md";
const MEETING_CALENDAR_URL =
  "https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week";

const governanceResources = [
  {
    title: "Technical Charter",
    description:
      "Read the formal scope, decision model, and operating rules for the Technical Steering Committee.",
    href: TECHNICAL_CHARTER_URL,
  },
  {
    title: "Governance Repository",
    description:
      "Track governance documents, committee updates, and cross-project policy changes on GitHub.",
    href: "https://github.com/hiero-ledger/governance",
  },
];

export default function TSCSection() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedTriggerIdRef = useRef<string | null>(null);

  const sorted = [...(tscMembers as Member[])].sort((a, b) =>
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

      if (lastFocusedTriggerIdRef.current) {
        const triggerButton = document.getElementById(
          lastFocusedTriggerIdRef.current,
        );
        triggerButton?.focus();
      }
    };
  }, [selectedMember]);

  return (
    <main className="bg-white text-charcoal">
      <section className="bg-linear-to-br from-red-dark via-red to-red text-white">
        <div className="container py-14 sm:py-22.5 lg:py-27.5">
          <div className="max-w-170 mx-auto text-center">
            <h1 className="text-[42px] sm:text-[53px] leading-none mb-4 text-center text-white">
              The Technical Steering Committee of Hiero
            </h1>
            <p className="text-base sm:text-lg max-w-150 mx-auto">
              The Hiero Technical Steering Committee (TSC) is the committee
              responsible for technical governance within the Hiero project.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href={TECHNICAL_CHARTER_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center rounded-full border-2 border-white bg-white px-5 py-2 text-sm font-medium text-red transition-colors hover:bg-gray-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red"
                aria-label="View Technical Charter (opens in new tab)">
                View Technical Charter
              </a>
              <a
                href={MEETING_CALENDAR_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center rounded-full border-2 border-white px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red"
                aria-label="Open Meeting Calendar (opens in new tab)">
                Open Meeting Calendar
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="tsc-about-heading"
        className="border-b border-white-dark bg-white">
        <div className="container py-10 sm:py-15">
          <div className="max-w-225">
            <h2 id="tsc-about-heading" className="text-2xl sm:text-4xl mb-5">
              About the TSC
            </h2>
            <div className="space-y-4 text-lg text-gray">
              <p>
                The Hiero Technical Steering Committee (TSC) is a committee of
                members who serve the project&apos;s technical governance.
              </p>
              <p>
                The duties, goals, and rights of the TSC are defined in the{" "}
                <a
                  href={TECHNICAL_CHARTER_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-red underline hover:text-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2"
                  aria-label="Read the technical charter (opens in new tab)">
                  technical charter
                </a>{" "}
                of the Hiero project.
              </p>
              <p>
                This page provides an overview of the current committee members
                and links to the core governance resources used by the project.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="tsc-members-heading" className="bg-gray-light">
        <div className="container py-10 sm:py-15 lg:py-20">
          <div className="mb-10 sm:mb-12">
            <h2 id="tsc-members-heading" className="text-2xl sm:text-4xl mb-5">
              Committee Members
            </h2>
            <p className="text-lg max-w-205">
              The committee is composed of contributors from across the Hiero
              ecosystem. Member bios reflect their current roles and ongoing
              work in open-source governance and technical delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {sorted.map((member, index) => {
              const fullName = `${member.firstName} ${member.lastName}`.trim();
              const hasBio = Boolean(member.bio?.trim());
              const bioPreview = hasBio
                ? getBioPreview(member.bio ?? "")
                : "Biography not available.";
              const githubHandle = getGitHubHandle(member.gitHubAccount);

              return (
                <article
                  key={`${fullName}-${index}`}
                  className="h-full rounded-2xl border-2 border-white-dark bg-white p-6 sm:p-7">
                  {member.photo ? (
                    <Image
                      src={`/images/tsc/${member.photo}`}
                      alt={`${fullName} profile photo for the Hiero Technical Steering Committee`}
                      width={320}
                      height={320}
                      className="aspect-square w-full rounded-xl object-cover"
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 40vw, 100vw"
                    />
                  ) : (
                    <div
                      className="aspect-square w-full rounded-xl bg-gray-light border border-white-dark"
                      aria-hidden="true"
                    />
                  )}

                  <div className="mt-5">
                    <h3 className="text-xl sm:text-2xl mb-2">{fullName}</h3>

                    {member.gitHubAccount ? (
                      <a
                        href={member.gitHubAccount}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 text-base text-red underline hover:text-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2"
                        aria-label={`Visit ${fullName} on GitHub (opens in new tab)`}>
                        <Image
                          src="/images/Hiero-Icon-Github.svg"
                          alt="GitHub"
                          width={16}
                          height={16}
                        />
                        {githubHandle ?? "GitHub profile"}
                      </a>
                    ) : null}

                    <p className="mt-4 text-base text-gray">{bioPreview}</p>

                    {hasBio ? (
                      <button
                        id={`tsc-read-profile-${index}`}
                        type="button"
                        onClick={() => {
                          lastFocusedTriggerIdRef.current = `tsc-read-profile-${index}`;
                          setSelectedMember(member);
                        }}
                        className="mt-4 inline-flex items-center rounded-full border-2 border-white-dark px-4 py-1.5 text-sm font-medium text-charcoal transition-colors hover:border-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2"
                        aria-label={`Read full profile for ${fullName}`}>
                        Read full profile
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="tsc-resources-heading" className="bg-white">
        <div className="container py-10 sm:py-15 lg:py-20">
          <div className="mb-10 sm:mb-12 max-w-225">
            <h2
              id="tsc-resources-heading"
              className="text-2xl sm:text-4xl mb-5">
              Governance Resources
            </h2>
            <p className="text-lg">
              Review the charter and follow governance activity through the
              project&apos;s primary source materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {governanceResources.map(resource => (
              <a
                key={resource.title}
                href={resource.href}
                target="_blank"
                rel="noreferrer noopener"
                className="flex h-full flex-col rounded-2xl border-2 border-white-dark bg-white p-6 no-underline text-charcoal transition-colors hover:border-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2"
                aria-label={`${resource.title} (opens in new tab)`}>
                <h3 className="text-xl font-medium mb-3">{resource.title}</h3>
                <p className="text-base text-gray grow">
                  {resource.description}
                </p>
                <span className="mt-5 text-base font-medium text-red underline">
                  Open resource
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {selectedMember ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tsc-member-modal-title"
          onClick={() => {
            setSelectedMember(null);
          }}>
          <div
            ref={modalRef}
            className="relative max-h-[90vh] w-full max-w-220 overflow-y-auto rounded-2xl border-2 border-white-dark bg-white p-6 sm:p-8"
            onClick={event => {
              event.stopPropagation();
            }}>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                setSelectedMember(null);
              }}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-red bg-white text-red shadow-xs transition-colors hover:bg-red hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2"
              aria-label="Close profile dialog">
              <span className="text-xl leading-none" aria-hidden="true">
                ×
              </span>
            </button>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-[220px_1fr] md:items-start">
              {selectedMember.photo ? (
                <Image
                  src={`/images/tsc/${selectedMember.photo}`}
                  alt={`${selectedMember.firstName} ${selectedMember.lastName} profile photo`}
                  width={220}
                  height={220}
                  className="aspect-square w-full rounded-xl object-cover"
                />
              ) : (
                <div
                  className="aspect-square w-full rounded-xl bg-gray-light border border-white-dark"
                  aria-hidden="true"
                />
              )}

              <div>
                <h3
                  id="tsc-member-modal-title"
                  className="text-2xl sm:text-3xl mb-3">
                  {selectedMember.firstName} {selectedMember.lastName}
                </h3>

                {selectedMember.gitHubAccount ? (
                  <a
                    href={selectedMember.gitHubAccount}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-base text-red underline hover:text-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2"
                    aria-label={`Visit ${selectedMember.firstName} ${selectedMember.lastName} on GitHub (opens in new tab)`}>
                    <Image
                      src="/images/Hiero-Icon-Github.svg"
                      alt="GitHub"
                      width={16}
                      height={16}
                    />
                    {getGitHubHandle(selectedMember.gitHubAccount) ??
                      "GitHub profile"}
                  </a>
                ) : null}

                <div className="mt-5 space-y-4 text-base text-gray sm:text-lg sm:leading-relaxed">
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
    </main>
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
