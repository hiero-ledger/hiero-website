import Link from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

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

export default function RichText({
  as: Tag = "div",
  className,
  inline = false,
  markdown,
}: RichTextProps) {
  if (!markdown.trim()) {
    return <Tag className={className} />;
  }

  const components = {
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
