import type { Metadata } from "next";
import ContributorsGrid from "@/components/ContributorsGrid";
import SimpleContentPage from "@/components/SimpleContentPage";
import { getSimplePage, type SimplePageContent } from "../../lib/posts";

export const metadata: Metadata = {
  title: "Hiero Heroes",
  description: "Meet the amazing contributors who have helped build Hiero",
};

export default async function HeroesPage() {
  const page: SimplePageContent | null = await getSimplePage(
    "content/heroes/index.md",
  );
  const title = page?.title ?? "Hiero Heroes";
  const description =
    page?.description ??
    "Meet the amazing contributors who have helped build Hiero";
  const contentHtml = page?.contentHtml ?? "";

  return (
    <SimpleContentPage
      title={title}
      description={description}
      contentHtml={contentHtml}>
      <ContributorsGrid endpoint="https://hedera-issues.koyeb.app/api/v2/contributors" />
    </SimpleContentPage>
  );
}
