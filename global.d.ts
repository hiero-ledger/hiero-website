declare module "*.css";
declare module "swiper/css";
declare module "swiper/css/pagination";
declare module "swiper/css/navigation";

declare module "html-react-parser" {
  import type { ReactNode } from "react";

  export default function parse(html: string, options?: unknown): ReactNode;
}
