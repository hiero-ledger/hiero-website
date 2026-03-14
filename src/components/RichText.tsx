import parse from "html-react-parser";

interface RichTextProps {
  as?: "div" | "h3" | "p" | "span";
  className?: string;
  html: string;
}

export default function RichText({
  as: Tag = "div",
  className,
  html,
}: RichTextProps) {
  return <Tag className={className}>{parse(html)}</Tag>;
}
