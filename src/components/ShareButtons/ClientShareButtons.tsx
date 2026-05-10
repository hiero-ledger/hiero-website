"use client";

import dynamic from "next/dynamic";

const ShareButtons = dynamic(() => import("./index"), { ssr: false });

export default function ClientShareButtons() {
  return <ShareButtons />;
}
