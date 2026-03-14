import type { Metadata } from "next";
import IssueList from "@/components/IssueList";
import SimpleContentPage from "@/components/SimpleContentPage";
import {
  getSimplePageWithDefaults,
  type SimplePageContent,
} from "../../lib/posts";

export const metadata: Metadata = {
  title: "Hacktoberfest 2024",
  description: "Contribute to Hiero by working on a good first issue",
};

const HACKTOBERFEST_PAGE_DEFAULTS = {
  title: "Hacktoberfest 2024",
  description: "Contribute to Hiero by working on a good first issue",
};

export default function HacktoberfestPage() {
  const page: SimplePageContent = getSimplePageWithDefaults(
    "content/hacktoberfest/index.md",
    HACKTOBERFEST_PAGE_DEFAULTS,
  );

  return (
    <SimpleContentPage
      title={page.title}
      description={page.description}
      contentMarkdown={page.contentMarkdown}>
      <IssueList endpoint="https://hedera-issues.koyeb.app/api/hacktoberfest-issues" />
    </SimpleContentPage>
  );
}
