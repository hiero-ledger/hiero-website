import Container from "@/components/Container";

export default function Footer() {
  return (
    <div className="bg-black text-base text-white-dark text-center py-8">
      <Container>
        <p>
          Copyright © Hiero a Series of LF Projects, LLC | For web site terms of
          use, trademark policy and other project policies please see{" "}
          <a
            href="https://lfprojects.org"
            target="_blank"
            rel="noreferrer noopener"
            className="text-white underline hover:text-white">
            https://lfprojects.org
          </a>
          .
        </p>
      </Container>
    </div>
  );
}
