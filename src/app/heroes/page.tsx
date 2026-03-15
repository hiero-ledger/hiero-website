import type { Metadata } from "next";
import ContributorsGrid from "@/components/ContributorsGrid";
import SimpleContentPage from "@/components/SimpleContentPage";
import {
  getSimplePageWithDefaults,
  type SimplePageContent,
} from "../../lib/posts";

export const metadata: Metadata = {
  title: "Hiero Heroes",
  description: "Meet the amazing contributors who have helped build Hiero",
};

const HEROES_PAGE_DEFAULTS = {
  title: "Hiero Heroes",
  description: "Meet the amazing contributors who have helped build Hiero",
};

export default function HeroesPage() {
  const page: SimplePageContent = getSimplePageWithDefaults(
    "content/heroes/index.md",
    HEROES_PAGE_DEFAULTS,
  );

  return (
    <SimpleContentPage
      title={page.title}
      description={page.description}
      contentMarkdown={page.contentMarkdown}>
      <ContributorsGrid endpoint="https://hedera-issues.koyeb.app/api/v2/contributors" />
    </SimpleContentPage>
  );
}
