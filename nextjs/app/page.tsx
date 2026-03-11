import HeroSection from "@/components/HeroSection";
import WhatIsHieroSection from "@/components/WhatIsHieroSection";
import Divider from "@/components/Divider";
import MeetSection from "@/components/MeetSection";
import ReposCarousel from "@/components/ReposCarousel";
import OpenSourceSection from "@/components/OpenSourceSection";
import QuotesCarousel from "@/components/QuotesCarousel";
import TSCSection from "@/components/TSCSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhatIsHieroSection />
      <Divider />
      <MeetSection />
      <Divider />
      <ReposCarousel />
      <Divider />
      <OpenSourceSection />
      <Divider />
      <QuotesCarousel />
      <TSCSection />
    </>
  );
}
