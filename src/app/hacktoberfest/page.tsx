import type { Metadata } from "next";
import IssueList from "@/components/IssueList";
import SimpleContentPage from "@/components/SimpleContentPage";
import { getSimplePage, type SimplePageContent } from "../../lib/posts";

export const metadata: Metadata = {
  title: "Hacktoberfest 2024",
  description: "Contribute to Hiero by working on a good first issue",
};

export default async function HacktoberfestPage() {
  const page: SimplePageContent | null = await getSimplePage(
    "content/hacktoberfest/index.md",
  );
  const title = page?.title ?? "Hacktoberfest 2024";
  const description =
    page?.description ?? "Contribute to Hiero by working on a good first issue";
  const contentHtml = page?.contentHtml ?? "";

  return (
    <SimpleContentPage
      title={title}
      description={description}
      contentHtml={contentHtml}>
      <IssueList endpoint="https://hedera-issues.koyeb.app/api/hacktoberfest-issues" />
    </SimpleContentPage>
  );
}
