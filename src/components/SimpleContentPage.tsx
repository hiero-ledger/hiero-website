import type { ReactNode } from "react";
import RichText from "@/components/RichText";

interface SimpleContentPageProps {
  title: string;
  description: string;
  contentMarkdown: string;
  children?: ReactNode;
}

export default function SimpleContentPage({
  title,
  description,
  contentMarkdown,
  children,
}: SimpleContentPageProps) {
  return (
    <>
      <div
        id="hero"
        className="bg-gradient-to-br from-red-dark via-red to-red relative">
        <div className="container py-14 sm:py-[100px] xl:py-36 text-white text-center">
          <h1 className="text-[42px] sm:text-5xl leading-none relative mb-2.5">
            {title}
          </h1>
          <p className="text-[24px] tracking-[-0.081rem] sm:text-xl relative">
            {description}
          </p>
        </div>
      </div>
      <div className="container py-14 sm:py-[80px] lg:py-[90px]">
        <main className="w-full min-w-0 max-w-[800px] mx-auto">
          <RichText
            markdown={contentMarkdown}
            className="content text-sm text-charcoal font-normal sm:text-base"
          />
          {children}
        </main>
      </div>
    </>
  );
}
