import type { Metadata } from "next";
import { getSimplePage } from "@/lib/posts";
import ContributorsGrid from "@/components/ContributorsGrid";
import parse from "html-react-parser";

export const metadata: Metadata = {
  title: "Hiero Heroes",
  description: "Meet the amazing contributors who have helped build Hiero",
};

export default async function HeroesPage() {
  const page = await getSimplePage("content/heroes/index.md");
  const title = page?.title ?? "Hiero Heroes";
  const description =
    page?.description ??
    "Meet the amazing contributors who have helped build Hiero";
  const contentHtml = page?.contentHtml ?? "";

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
          <div className="content text-sm text-charcoal font-normal sm:text-base">
            {parse(contentHtml)}
          </div>
          <ContributorsGrid endpoint="https://hedera-issues.koyeb.app/api/v2/contributors" />
        </main>
      </div>
    </>
  );
}
