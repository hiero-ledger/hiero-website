import { permanentRedirect } from "next/navigation";

export function GET(): Response {
  permanentRedirect("/feed.xml");
}
