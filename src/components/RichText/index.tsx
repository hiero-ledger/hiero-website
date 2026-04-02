import Link from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

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
    ...(inline ? { p: InlineParagraph } : {}),
  };

  return (
    <Tag className={className}>
      <ReactMarkdown skipHtml components={components}>
        {markdown}
      </ReactMarkdown>
    </Tag>
  );
}
