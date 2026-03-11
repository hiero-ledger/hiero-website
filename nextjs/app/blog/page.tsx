import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest updates, announcements, and community stories from the Hiero ecosystem.",
};

export default function BlogPage() {
  return (
    <div id="hero" className="bg-linear-to-br from-red-dark via-red to-red relative">
      <div className="container py-14 sm:py-25 xl:py-36 text-white text-center">
        <h1 className="text-[42px] sm:text-5xl leading-none relative mb-2.5">Hiero Blog</h1>
        <p className="text-[24px] tracking-[-0.081rem] sm:text-xl relative">
          Stay up to date with our latest news and announcements.
        </p>
      </div>
    </div>
  );
}
