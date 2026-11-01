import Divider from "@/components/Divider";
import EventsSection from "@/components/EventsSection";
import HeroSection from "@/components/HeroSection";
import IssueJumpSection from "@/components/IssueJumpSection";
import MeetSection from "@/components/MeetSection";
import QuotesCarousel from "@/components/QuotesCarousel";
import ReposGrid from "@/components/ReposGrid";
import WhatIsHieroSection from "@/components/WhatIsHieroSection";
import {
  eventsData,
  heroData,
  issueJumpData,
  meetData,
  quotesData,
  reposData,
  whatIsHieroData,
} from "@/data/homePageData";
import { getCommunityEvents } from "@/lib/events";

export default function Home() {
  const events = getCommunityEvents();

  return (
    <>
      <HeroSection data={heroData} />
      <WhatIsHieroSection data={whatIsHieroData} />
      <Divider />
      <IssueJumpSection data={issueJumpData} />
      <Divider />
      <MeetSection data={meetData} />
      <Divider />
      {/* With no event posts the band renders nothing, so its divider goes
          with it rather than leaving two stacked. */}
      {events.length > 0 ? (
        <>
          <EventsSection data={eventsData} events={events} />
          <Divider />
        </>
      ) : null}
      <ReposGrid data={reposData} />
      <Divider />
      <QuotesCarousel data={quotesData} />
    </>
  );
}
