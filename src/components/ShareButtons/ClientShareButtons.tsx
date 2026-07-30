"use client";

import ShareButtons from "./index";

interface ClientShareButtonsProps {
  shareUrl: string;
  shareTitle: string;
}

export default function ClientShareButtons({
  shareUrl,
  shareTitle,
}: ClientShareButtonsProps) {
  return <ShareButtons shareUrl={shareUrl} shareTitle={shareTitle} />;
}
