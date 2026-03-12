import Image from "next/image";

const whatIsHieroData = {
  heading: "What is Hiero?",
  text: 'Hiero, a <a href="http://www.lfdecentralizedtrust.org/" target="_blank" rel="noreferrer noopener">Linux Foundation Decentralized Trust</a> project, is an open-source, vendor-neutral distributed ledger technology. Hiero is used to build the <a href="https://hedera.com/" target="_blank" rel="noreferrer noopener">Hedera</a> public ledger.',
  points: [
    {
      heading: "Hiero is <strong>fair</strong>",
      text: "Everybody should have equal access to all public forums. No one should have the ability to re-prioritize your transactions, or drop them, or front-run, or sandwich trade, or otherwise disadvantage you. The hashgraph algorithm is leaderless. We all deserve a more fair world.",
      icon: "/images/Hiero-Icon-Fair.svg",
    },
    {
      heading: "Hiero is <strong>fast</strong>",
      text: "You shouldn't have to sacrifice performance for fairness or security. The world of interconnected businesses and networks continues to expand at an accelerating rate. Waiting minutes for transactions to finalize doesn't meet your requirements. The hashgraph algorithm isn't just fair, it is also fast.",
      icon: "/images/Hiero-Icon-Fast.svg",
    },
    {
      heading: "Hiero is <strong>secure</strong>",
      text: "The hashgraph algorithm is asynchronous Byzantine Fault Tolerant (ABFT). This is the gold standard in distributed network security. Your transactions are protected from bad actors with the highest security available.",
      icon: "/images/Hiero-Icon-Secure.svg",
    },
    {
      heading: "Hiero is <strong>decentralized</strong>",
      text: "No one entity should have complete control of your future. Spreading power and influence out among many participants, all with equal access, helps secure your access to the network and your data. You should be able to participate in the network, in its development, and in its use. This network belongs to the world. It belongs to the future.",
      icon: "/images/Hiero-Icon-Decentralized.svg",
    },
    {
      heading: "Hiero is <strong>leaderless</strong>",
      text: "A ledger with a leader-based consensus protocol is inherently unfair, and either slow or susceptible to denial of service attacks. We believe in a future where every node can participate on an equal basis with a completely leaderless consensus protocol, safe from denial-of- service, and safe from centralization.",
      icon: "/images/Hiero-Icon-Leaderless.svg",
    },
    {
      heading: "Hiero is <strong>open</strong>",
      text: "Hiero is a vibrant community of developers, visionaries, and innovators dedicated to creating a more fair, efficient, and secure world. As part of the Linux Foundation Decentralized Trust initiative, we are pioneering a new era of open governance and collaboration for the project.",
      icon: "/images/Hiero-Icon-Open.svg",
    },
  ],
};

export default function WhatIsHieroSection() {
  return (
    <div id="what-is-hiero" className="anchor">
      <div className="bg-white">
        <div
          id="what-is-hiero-content"
          className="container pt-[80px] pb-[40px] sm:pt-[120px] sm:pb-[120px] grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-[60px] lg:gap-32"
        >
          <div id="what-is-hiero-intro-column">
            <div id="what-is-hiero-intro">
              <h2 className="text-3xl mb-2.5 sm:text-4xl sm:mb-0">
                {whatIsHieroData.heading}
              </h2>
              <p
                className="text-base sm:text-lg max-w-[390px]"
                dangerouslySetInnerHTML={{ __html: whatIsHieroData.text }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-[60px] sm:gap-10">
            {whatIsHieroData.points.map((point, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr] sm:grid-cols-[55px_1fr] gap-5 sm:gap-10"
              >
                <Image
                  src={point.icon}
                  alt=""
                  width={55}
                  height={55}
                  loading="lazy"
                />
                <div>
                  <h3
                    className="text-2xl mb-5 sm:mb-2 [&>strong]:text-red"
                    dangerouslySetInnerHTML={{ __html: point.heading }}
                  />
                  <p className="text-base">{point.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

