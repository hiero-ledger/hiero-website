"use client";

import { lazy, Suspense } from "react";

const ShareButtons = lazy(() => import("./index"));

export default function ClientShareButtons() {
  return (
    <Suspense fallback={null}>
      <ShareButtons />
    </Suspense>
  );
}
