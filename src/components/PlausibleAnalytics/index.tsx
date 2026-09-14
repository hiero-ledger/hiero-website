"use client";

import { init } from "@plausible-analytics/tracker";
import { useEffect } from "react";

/**
 * The tracker touches browser APIs only, so it is initialised from an effect
 * rather than rendered as a script tag.
 *
 * Unlike the hosted script, which bakes the dashboard's settings in, the npm
 * package defaults outbound links, downloads and form submissions to off.
 * They are set explicitly so the site keeps reporting what it reports today.
 */
const CONFIG = {
  domain: "hiero.org",
  outboundLinks: true,
  fileDownloads: true,
  formSubmissions: true,
} as const;

// init() binds its own listeners and is not idempotent, so a second call would
// double every pageview. React runs effects twice in development.
let initialised = false;

export default function PlausibleAnalytics() {
  useEffect(() => {
    if (initialised) return;
    initialised = true;

    init(CONFIG);
  }, []);

  return null;
}
