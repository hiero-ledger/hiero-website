import Link from "next/link";
import Container from "@/components/Container";
import Menu from "@/components/Menu";

export default function Header() {
  return (
    <div className="h-[90px] flex items-center fixed inset-x-0 top-0 z-50 bg-white">
      <Container>
        <div className="flex flex-row justify-between items-center">
          <Link href="/" aria-label="Go to homepage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Hiero-Icon-wLogo.svg"
              alt="Hiero logo"
              className="h-[40px] w-[128px]"
            />
          </Link>
          <Menu />
        </div>
      </Container>
    </div>
  );
}
