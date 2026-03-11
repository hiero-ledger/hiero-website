import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Menu from "@/components/Menu";

export default function Header() {
  return (
    <div className="h-[90px] flex items-center fixed inset-x-0 top-0 z-50 bg-white">
      <Container>
        <div className="flex flex-row justify-between items-center">
          <Link href="/" aria-label="Go to homepage">
            <Image src="/images/Hiero-Icon-wLogo.svg" alt="Hiero logo" className="h-[40px] w-[128px]" width={128} height={40} priority />
          </Link>
          <Menu />
        </div>
      </Container>
    </div>
  );
}
