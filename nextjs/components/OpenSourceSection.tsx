import Image from "next/image";

const openSourceData = {
  whyHeading: "Why is Hiero Open Source?",
  whyText:
    "The main goal of Hiero is to create a diverse community of developers, dreamers, and builders working to make the world more fair, fast, and secure. To achieve that goal it is critical that everyone can access the source of Hiero and move the project forward. A decentralized network that is used by enterprises and critical infrastructure around the world must be vendor-neutral and fully auditable.",
  whatHeading: "What parts of Hiero are Open Source?",
  whatText:
    'Hiero is 100% open-source. While the transition of the project to Linux Foundation Decentralized Trust is still ongoing, a view into some additional contributions can be found in <a href="https://github.com/hashgraph" target="_blank" rel="noreferrer noopener">Hedera\'s GitHub organization</a>. As a first step, the technical steering committee (TSC) of Hiero will provide oversight to include  projects that are needed to run an enterprise-ready decentralized network to a new Hiero GitHub organization. More information about the transition process can be found in the roadmap.',
};

export default function OpenSourceSection() {
  return (
    <div className="bg-white">
      <div className="container pt-[40px] pb-[40px] sm:pt-[92px] sm:pb-[154px] grid grid-cols-1 sm:grid-cols-2 gap-[80px] sm:gap-10 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Hiero-Logo-Outline.svg"
          alt=""
          className="sm:absolute w-full h-full sm:top-[50%] sm:left-[50%] sm:-translate-x-[50%] sm:-translate-y-[50%] pointer-events-none"
          loading="lazy"
        />
        <div id="open-source" className="anchor anchor--open-source relative">
          <div className="h-14 w-14 mb-5">
            <Image
              src="/images/Hiero-Icon-Heart.svg"
              alt=""
              width={56}
              height={56}
              loading="lazy"
            />
          </div>
          <h2 className="text-2xl font-medium mb-5">{openSourceData.whyHeading}</h2>
          <p className="text-base max-w-[565px]">{openSourceData.whyText}</p>
        </div>
        <div className="relative">
          <div className="h-14 w-14 mb-5">
            <Image
              src="/images/Hiero-Icon-OpenSource.svg"
              alt=""
              width={56}
              height={56}
              loading="lazy"
            />
          </div>
          <h2 className="text-2xl font-medium mb-5">{openSourceData.whatHeading}</h2>
          <p
            className="text-base max-w-[565px]"
            dangerouslySetInnerHTML={{ __html: openSourceData.whatText }}
          />
        </div>
      </div>
    </div>
  );
}

