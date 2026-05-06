import Divider from "@/components/Divider";
import HeroSection from "@/components/HeroSection";
import IssueJumpSection from "@/components/IssueJumpSection";
import MeetSection from "@/components/MeetSection";
import QuotesCarousel from "@/components/QuotesCarousel";
import ReposGrid from "@/components/ReposGrid";
import WhatIsHieroSection from "@/components/WhatIsHieroSection";
import {
  heroData,
  issueJumpData,
  meetData,
  quotesData,
  reposData,
  whatIsHieroData,
} from "@/data/homePageData";

export default function Home() {
  return (
    <>
      <HeroSection data={heroData} />
      <WhatIsHieroSection data={whatIsHieroData} />
      <Divider />
      <IssueJumpSection data={issueJumpData} />
      <Divider />
      <MeetSection data={meetData} />
      <Divider />
      <ReposGrid data={reposData} />
      <Divider />
      <QuotesCarousel data={quotesData} />
    </>
  );
}
