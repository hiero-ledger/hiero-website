import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { createSlugger } from "@/lib/headings";

interface RichTextProps {
  as?: "div" | "h3" | "p" | "span";
  className?: string;
  inline?: boolean;
  markdown: string;
}

function isExternalHref(href: string): boolean {
  const normalizedHref = href.toLowerCase();

  return (
    normalizedHref.startsWith("http://") ||
    normalizedHref.startsWith("https://") ||
    normalizedHref.startsWith("//") ||
    normalizedHref.startsWith("mailto:")
  );
}

function InlineParagraph({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

/**
 * The words a heading renders as, whatever inline markup it is built from.
 * `react-markdown` hands headings their children as a tree — a bolded phrase
 * arrives as an element, not a string — so the text has to be gathered rather
 * than read off.
 */
function textOf(children: ReactNode): string {
  return Children.toArray(children)
    .map(child => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement(child)) {
        return textOf((child.props as { children?: ReactNode }).children);
      }

      return "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

export default function RichText({
  as: Tag = "div",
  className,
  inline = false,
  markdown,
}: RichTextProps) {
  if (!markdown.trim()) {
    return <Tag className={className} />;
  }

  /**
   * One slugger per render, shared by h1–h3 below. `react-markdown` renders
   * them in document order, so its duplicate counters line up with the ones
   * `extractHeadings` produced for the contents list.
   */
  const slug = createSlugger();

  const anchored = (Tag: "h1" | "h2" | "h3") => {
    function AnchoredHeading({ children }: { children?: ReactNode }) {
      return <Tag id={slug(textOf(children))}>{children}</Tag>;
    }

    AnchoredHeading.displayName = `Anchored${Tag.toUpperCase()}`;

    return AnchoredHeading;
  };

  const components = {
    h1: anchored("h1"),
    h2: anchored("h2"),
    h3: anchored("h3"),
    a({ href = "", children }: { href?: string; children?: ReactNode }) {
      if (!href) return <>{children}</>;

      const linkClass =
        "text-red underline hover:text-red-dark transition-colors";

      if (isExternalHref(href)) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className={linkClass}>
            {children}
          </a>
        );
      }

      return (
        <Link href={href} className={linkClass}>
          {children}
        </Link>
      );
    },
    /* Hairlines and a mono header row rather than a filled bar: a table in a
       post is data to read, and the rest of the site draws data with rules.
       The wrapper scrolls so a wide table never widens the reading column. */
    table({ children }: { children?: ReactNode }) {
      return (
        <div className="my-[2em] max-w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-[0.9375rem]">
            {children}
          </table>
        </div>
      );
    },
    th({ children }: { children?: ReactNode }) {
      return (
        <th className="border-b border-charcoal/28 px-4 py-3 align-top font-ibm text-[0.6875rem] leading-none tracking-[0.12em] text-charcoal/62 uppercase">
          {children}
        </th>
      );
    },
    td({ children }: { children?: ReactNode }) {
      return (
        <td className="border-b border-charcoal/14 px-4 py-3 align-top">
          {children}
        </td>
      );
    },
    ...(inline ? { p: InlineParagraph } : {}),
  };

  return (
    <Tag className={className}>
      <ReactMarkdown
        skipHtml
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}>
        {markdown}
      </ReactMarkdown>
    </Tag>
  );
}
