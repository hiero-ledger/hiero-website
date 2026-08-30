"use client";

import Container from "@/components/Container";
import RichText from "@/components/RichText";
import { useEffect, useRef, useState } from "react";
import { useIssues } from "@/hooks/useIssues";
import { GitHubIssue } from "@/issues/types";

type Difficulty = {
  label: string;
  value: string;
};

const difficultyAliases: Record<string, string[]> = {
  "good first issue": ["good first issue", "skill: good first issue"],
  beginner: ["beginner", "skill: beginner"],
  intermediate: ["intermediate", "skill: intermediate"],
  advanced: ["advanced", "skill: advanced"],
};

function getDifficulty(issue: GitHubIssue): Difficulty | null {
  const issueWithLabels = issue as GitHubIssue & {
    labels?: Array<string | { name?: string }>;
  };

  const labels = issueWithLabels.labels ?? [];

  const labelNames = labels.map(label =>
    (typeof label === "string" ? label : (label.name ?? "")).toLowerCase(),
  );

  for (const [difficulty, aliases] of Object.entries(difficultyAliases)) {
    const found = aliases.some(alias =>
      labelNames.includes(alias.toLowerCase()),
    );

    if (found) {
      return {
        label:
          difficulty === "good first issue"
            ? "Good First Issue"
            : difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        value: difficulty,
      };
    }
  }

  return null;
}

function getDifficultyClasses(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "good first issue":
      return "border-[#A7E8C7] bg-[#F0FFF7] text-[#16804F]";

    case "beginner":
      return "border-[#B7D6FF] bg-[#F2F7FF] text-[#2768C7]";

    case "intermediate":
      return "border-[#F1D27A] bg-[#FFF9E8] text-[#B47700]";

    case "advanced":
      return "border-[#F2B4B4] bg-[#FFF3F3] text-[#C62828]";

    default:
      return "border-gray-light bg-white text-gray";
  }
}

function getRepositoryName(repositoryUrl: string) {
  return repositoryUrl.split("/").pop() ?? "unknown";
}

/**
 * Animated network background used in the Issue Explorer hero.
 *
 * The animation intentionally moves slowly so it feels like the
 * background in the design reference rather than a distracting
 * foreground animation.
 */
function AnimatedNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    type Node = {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      phase: number;
      person: boolean;
    };

    const nodes: Node[] = [
      {
        x: 0.07,
        y: 0.53,
        radius: 31,
        speedX: 0.0007,
        speedY: -0.0003,
        phase: 0.4,
        person: true,
      },
      {
        x: 0.18,
        y: 0.32,
        radius: 6,
        speedX: -0.0005,
        speedY: 0.0007,
        phase: 1.4,
        person: false,
      },
      {
        x: 0.29,
        y: 0.39,
        radius: 28,
        speedX: 0.0004,
        speedY: 0.0006,
        phase: 2.2,
        person: true,
      },
      {
        x: 0.36,
        y: 0.55,
        radius: 20,
        speedX: -0.0006,
        speedY: -0.0004,
        phase: 3.1,
        person: true,
      },
      {
        x: 0.47,
        y: 0.27,
        radius: 19,
        speedX: 0.0005,
        speedY: 0.0004,
        phase: 4.2,
        person: true,
      },
      {
        x: 0.51,
        y: 0.63,
        radius: 29,
        speedX: -0.0004,
        speedY: 0.0005,
        phase: 1.8,
        person: true,
      },
      {
        x: 0.62,
        y: 0.43,
        radius: 6,
        speedX: 0.0006,
        speedY: -0.0006,
        phase: 2.8,
        person: false,
      },
      {
        x: 0.65,
        y: 0.2,
        radius: 17,
        speedX: -0.0004,
        speedY: 0.0005,
        phase: 5.2,
        person: true,
      },
      {
        x: 0.73,
        y: 0.53,
        radius: 25,
        speedX: 0.0005,
        speedY: -0.0003,
        phase: 3.7,
        person: true,
      },
      {
        x: 0.82,
        y: 0.35,
        radius: 7,
        speedX: -0.0006,
        speedY: 0.0004,
        phase: 0.9,
        person: false,
      },
      {
        x: 0.9,
        y: 0.6,
        radius: 5,
        speedX: 0.0004,
        speedY: -0.0005,
        phase: 2.1,
        person: false,
      },
      {
        x: 0.97,
        y: 0.45,
        radius: 6,
        speedX: -0.0005,
        speedY: 0.0003,
        phase: 4.8,
        person: false,
      },
      {
        x: 0.13,
        y: 0.83,
        radius: 5,
        speedX: 0.0005,
        speedY: -0.0004,
        phase: 1.2,
        person: false,
      },
      {
        x: 0.31,
        y: 0.82,
        radius: 4,
        speedX: -0.0004,
        speedY: 0.0005,
        phase: 3.4,
        person: false,
      },
      {
        x: 0.55,
        y: 0.86,
        radius: 5,
        speedX: 0.0006,
        speedY: -0.0004,
        phase: 4.5,
        person: false,
      },
      {
        x: 0.76,
        y: 0.82,
        radius: 5,
        speedX: -0.0005,
        speedY: -0.0003,
        phase: 2.6,
        person: false,
      },
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawPerson = (x: number, y: number, radius: number) => {
      const headRadius = radius * 0.28;
      const bodyWidth = radius * 0.9;
      const bodyHeight = radius * 0.62;

      context.save();

      context.fillStyle = "rgba(255,255,255,0.45)";

      // Head
      context.beginPath();
      context.arc(x, y - radius * 0.28, headRadius, 0, Math.PI * 2);
      context.fill();

      // Body
      context.beginPath();
      context.ellipse(
        x,
        y + radius * 0.25,
        bodyWidth / 2,
        bodyHeight / 2,
        0,
        Math.PI,
        0,
      );
      context.fill();

      context.restore();
    };

    const drawNode = (node: Node, x: number, y: number, pulse: number) => {
      if (node.person) {
        context.save();

        // Outer rings around person nodes.
        context.strokeStyle = "rgba(255,255,255,0.12)";
        context.lineWidth = 1;

        context.beginPath();
        context.arc(x, y, node.radius * 1.45 + pulse, 0, Math.PI * 2);
        context.stroke();

        context.beginPath();
        context.arc(x, y, node.radius * 1.2 + pulse * 0.5, 0, Math.PI * 2);
        context.stroke();

        drawPerson(x, y, node.radius);

        context.restore();
      } else {
        context.save();

        context.fillStyle = "rgba(255,255,255,0.45)";

        context.beginPath();
        context.arc(x, y, node.radius, 0, Math.PI * 2);
        context.fill();

        context.restore();
      }
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      /*
       * Subtle grid matching the existing Hero design.
       */
      context.save();

      context.strokeStyle = "rgba(255,255,255,0.055)";
      context.lineWidth = 1;

      const gridSize = 54;

      for (let x = 0; x <= width; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      context.restore();

      const positions = nodes.map(node => {
        const movementTime = prefersReducedMotion ? 0 : time;

        const x =
          node.x * width +
          Math.sin(movementTime * node.speedX + node.phase) * 45;

        const y =
          node.y * height +
          Math.cos(movementTime * node.speedY + node.phase) * 32;

        return { x, y };
      });

      /*
       * Draw connections between nearby nodes.
       */
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const first = positions[i];
          const second = positions[j];

          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = Math.min(width * 0.2, 250);

          if (distance > maxDistance) {
            continue;
          }

          const opacity = (1 - distance / maxDistance) * 0.22;

          context.save();
          context.strokeStyle = `rgba(255,255,255,${opacity})`;
          context.lineWidth = 1;

          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();

          context.restore();
        }
      }

      /*
       * Draw nodes after the connections so they remain visible.
       */
      nodes.forEach((node, index) => {
        const position = positions[index];

        const pulse = prefersReducedMotion
          ? 0
          : Math.sin(time * 0.0015 + node.phase) * 2;

        drawNode(node, position.x, position.y, pulse);
      });

      if (!prefersReducedMotion) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    resize();

    window.addEventListener("resize", resize);

    if (prefersReducedMotion) {
      draw(0);
    } else {
      animationFrame = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function IssueExplorer() {
  const [difficulty, setDifficulty] = useState<string>("");
  const [sdk, setSdk] = useState<string>("");

  const {
    issues,
    loading,
    error,
  }: {
    issues: GitHubIssue[];
    loading: boolean;
    error: string | null;
  } = useIssues(difficulty, sdk);

  return (
    <div className="min-h-screen bg-white font-serif text-charcoal">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#24000F]">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(
                circle at 70% 20%,
                rgba(217, 45, 106, 0.55),
                transparent 34%
              ),
              radial-gradient(
                circle at 88% 55%,
                rgba(184, 26, 86, 0.85),
                transparent 45%
              ),
              linear-gradient(
                110deg,
                #21000d 0%,
                #5d0b2c 38%,
                #b81a56 100%
              )
            `,
          }}
        />

        {/* Animated network */}
        <AnimatedNetwork />

        <Container>
          <div className="relative z-10 flex min-h-[580px] items-center py-24 sm:min-h-[580px] lg:min-h-[580px]">
            <div className="max-w-[620px]">
              <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                <span className="h-2 w-2 rounded-full bg-red-light" />
                Open Source · Hiero SDKs
              </div>

              <h1 className="max-w-[520px] text-6xl font-medium leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl lg:text-[7.5rem] lg:leading-[0.88]">
                Issue
                <br />
                Explorer
              </h1>

              <div className="my-8 h-px w-24 bg-white" />

              <p className="max-w-[520px] text-lg leading-7 tracking-[-0.02em] text-white/80 sm:text-xl">
                Find open issues across Hiero and start contributing!
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/20 bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm">
                  {issues.length} open issues
                </span>

                <span className="rounded-full border border-white/20 bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm">
                  Ready to contribute
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-light bg-white">
        <Container>
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Difficulty */}
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="h-10 min-w-[140px] appearance-none rounded-lg border border-gray-light bg-white px-4 pr-10 text-sm font-medium text-charcoal outline-none transition-colors hover:border-gray focus:border-red focus:ring-2 focus:ring-red-light/20">
                  <option value="">All Difficulties</option>
                  <option value="good first issue">Good First Issue</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray">
                  ▾
                </span>
              </div>

              {/* Repository */}
              <div className="relative">
                <select
                  value={sdk}
                  onChange={e => setSdk(e.target.value)}
                  className="h-10 min-w-[110px] appearance-none rounded-lg border border-gray-light bg-white px-4 pr-10 text-sm font-medium text-charcoal outline-none transition-colors hover:border-gray focus:border-red focus:ring-2 focus:ring-red-light/20">
                  <option value="">All Repos</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="swift">Swift</option>
                </select>

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray">
                  ▾
                </span>
              </div>
            </div>

            <div className="w-fit rounded-lg border border-gray-light bg-gray-light/40 px-4 py-2 text-sm font-medium text-charcoal">
              {issues.length} {issues.length === 1 ? "issue" : "issues"}
            </div>
          </div>
        </Container>
      </section>

      {/* Issue list */}
      <main className="bg-[#FAFAF9]">
        <Container>
          <div className="py-9 sm:py-10">
            {loading && (
              <div className="py-20 text-center">
                <p className="text-lg text-gray">Loading issues...</p>
              </div>
            )}

            {typeof error === "string" && (
              <div className="rounded-xl border border-red/20 bg-red/5 p-6 text-red">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && issues.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-lg text-gray">
                  No issues found matching the selected filters.
                </p>
              </div>
            )}

            {!loading && !error && issues.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {issues.map(issue => {
                  const issueDifficulty = getDifficulty(issue);
                  const repository = getRepositoryName(issue.repository_url);

                  return (
                    <a
                      key={issue.id}
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-[185px] flex-col rounded-xl border border-[#E8E8E6] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-red/30 hover:shadow-[0_8px_30px_rgba(30,30,30,0.08)]">
                      {/* Repository */}
                      <div>
                        <span className="inline-flex rounded-md bg-red/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-red">
                          {repository}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="mt-4 flex-1">
                        <RichText
                          markdown={issue.title ?? ""}
                          className="line-clamp-3 text-[15px] font-medium leading-5 tracking-[-0.02em] text-charcoal"
                        />
                      </div>

                      {/* Bottom row */}
                      <div className="mt-5 flex items-center justify-between border-t border-gray-light pt-4">
                        <div>
                          {issueDifficulty ? (
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${getDifficultyClasses(
                                issueDifficulty.value,
                              )}`}>
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {issueDifficulty.label}
                            </span>
                          ) : (
                            <span className="text-xs text-gray">
                              Open issue
                            </span>
                          )}
                        </div>

                        <span className="text-lg text-gray transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red">
                          →
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}
