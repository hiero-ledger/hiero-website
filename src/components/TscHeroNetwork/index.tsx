"use client";

import { useEffect, useRef } from "react";

/**
 * Animated network background for the TSC masthead.
 *
 * The animation creates a subtle, slowly moving network of nodes and
 * connections while keeping the page content easy to read.
 *
 * Its own file rather than a function inside `app/tsc/page.tsx`: the canvas is
 * the only part of that page that has to run in the browser, and keeping it
 * here lets the page itself stay a server component and declare its metadata.
 */
export default function TscHeroNetwork() {
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

    type NetworkNode = {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      phase: number;
      person: boolean;
    };

    const nodes: NetworkNode[] = [
      {
        x: 0.04,
        y: 0.25,
        radius: 5,
        speedX: 0.0005,
        speedY: 0.0004,
        phase: 0.5,
        person: false,
      },
      {
        x: 0.11,
        y: 0.67,
        radius: 26,
        speedX: -0.0004,
        speedY: 0.0005,
        phase: 1.2,
        person: true,
      },
      {
        x: 0.2,
        y: 0.35,
        radius: 5,
        speedX: 0.0006,
        speedY: -0.0004,
        phase: 2.4,
        person: false,
      },
      {
        x: 0.29,
        y: 0.2,
        radius: 19,
        speedX: -0.0005,
        speedY: 0.0004,
        phase: 3.2,
        person: true,
      },
      {
        x: 0.34,
        y: 0.77,
        radius: 6,
        speedX: 0.0004,
        speedY: -0.0005,
        phase: 4.1,
        person: false,
      },
      {
        x: 0.43,
        y: 0.34,
        radius: 28,
        speedX: 0.0005,
        speedY: 0.0005,
        phase: 1.8,
        person: true,
      },
      {
        x: 0.51,
        y: 0.7,
        radius: 5,
        speedX: -0.0005,
        speedY: -0.0004,
        phase: 2.7,
        person: false,
      },
      {
        x: 0.59,
        y: 0.18,
        radius: 5,
        speedX: 0.0004,
        speedY: 0.0005,
        phase: 4.6,
        person: false,
      },
      {
        x: 0.65,
        y: 0.48,
        radius: 21,
        speedX: -0.0006,
        speedY: 0.0003,
        phase: 3.5,
        person: true,
      },
      {
        x: 0.74,
        y: 0.76,
        radius: 5,
        speedX: 0.0005,
        speedY: -0.0004,
        phase: 1.1,
        person: false,
      },
      {
        x: 0.79,
        y: 0.27,
        radius: 27,
        speedX: -0.0004,
        speedY: 0.0005,
        phase: 5.1,
        person: true,
      },
      {
        x: 0.89,
        y: 0.58,
        radius: 6,
        speedX: 0.0006,
        speedY: -0.0003,
        phase: 2.2,
        person: false,
      },
      {
        x: 0.96,
        y: 0.31,
        radius: 5,
        speedX: -0.0005,
        speedY: 0.0004,
        phase: 3.8,
        person: false,
      },
      {
        x: 0.94,
        y: 0.82,
        radius: 17,
        speedX: 0.0004,
        speedY: -0.0005,
        phase: 0.8,
        person: true,
      },
      {
        x: 0.18,
        y: 0.88,
        radius: 4,
        speedX: -0.0005,
        speedY: 0.0003,
        phase: 4.4,
        person: false,
      },
      {
        x: 0.56,
        y: 0.91,
        radius: 4,
        speedX: 0.0005,
        speedY: -0.0004,
        phase: 2.9,
        person: false,
      },
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const drawPerson = (x: number, y: number, radius: number) => {
      const headRadius = radius * 0.27;
      const bodyWidth = radius * 0.9;
      const bodyHeight = radius * 0.62;

      context.save();

      context.fillStyle = "rgba(255,255,255,0.38)";

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

    const drawNode = (
      node: NetworkNode,
      x: number,
      y: number,
      pulse: number,
    ) => {
      if (node.person) {
        context.save();

        // Outer network rings
        context.strokeStyle = "rgba(255,255,255,0.10)";
        context.lineWidth = 1;

        context.beginPath();
        context.arc(x, y, node.radius * 1.45 + pulse, 0, Math.PI * 2);
        context.stroke();

        context.beginPath();
        context.arc(x, y, node.radius * 1.18 + pulse * 0.5, 0, Math.PI * 2);
        context.stroke();

        drawPerson(x, y, node.radius);

        context.restore();
      } else {
        context.save();

        context.fillStyle = "rgba(255,255,255,0.40)";

        context.beginPath();
        context.arc(x, y, node.radius, 0, Math.PI * 2);
        context.fill();

        context.restore();
      }
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      /*
       * Subtle grid.
       */
      context.save();

      context.strokeStyle = "rgba(255,255,255,0.045)";
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
       * Connect nearby nodes.
       */
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const first = positions[i];
          const second = positions[j];

          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = Math.min(width * 0.22, 260);

          if (distance > maxDistance) {
            continue;
          }

          const opacity = (1 - distance / maxDistance) * 0.2;

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
       * Draw nodes on top of connections.
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
