import { redirect } from "next/navigation";

export function GET(): Response {
  redirect("/feed.xml");
}
