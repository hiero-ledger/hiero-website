"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";

const ShareButtons: ComponentType = dynamic(() => import("./index"), {
  ssr: false,
});

export default function ClientShareButtons() {
  return <ShareButtons />;
}
