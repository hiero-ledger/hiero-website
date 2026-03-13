import type { Metadata } from "next";
import { getSimplePage } from "@/src/lib/posts";
import IssueList from "@/components/IssueList";

export const metadata: Metadata = {
  title: "Hacktoberfest 2024",
  description: "Contribute to Hiero by working on a good first issue",
};

export default async function HacktoberfestPage() {
  const page = await getSimplePage("content/hacktoberfest/index.md");
  const title = page?.title ?? "Hacktoberfest 2024";
  const description =
    page?.description ?? "Contribute to Hiero by working on a good first issue";
  const contentHtml = page?.contentHtml ?? "";

  return (
    <>
      <div
        id="hero"
        className="bg-gradient-to-br from-red-dark via-red to-red relative"
      >
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
          <div
            className="content text-sm text-charcoal font-normal sm:text-base"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
          <IssueList endpoint="https://hedera-issues.koyeb.app/api/hacktoberfest-issues" />
        </main>
      </div>
    </>
  );
}
