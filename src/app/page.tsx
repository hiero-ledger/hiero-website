import HeroSection from "@/components/HeroSection";
import WhatIsHieroSection from "@/components/WhatIsHieroSection";
import Divider from "@/components/Divider";
import MeetSection from "@/components/MeetSection";
import ReposCarousel from "@/components/ReposCarousel";
import IssueJumpSection from "@/components/IssueJumpSection";
import OpenSourceSection from "@/components/OpenSourceSection";
import QuotesCarousel from "@/components/QuotesCarousel";

const heroData = {
  heading: "Hiero",
  text: "Open Source Distributed Ledger Technology",
};

const whatIsHieroData = {
  heading: "What is Hiero?",
  text: "Hiero, a [Linux Foundation Decentralized Trust](http://www.lfdecentralizedtrust.org/) project, is an open-source, vendor-neutral distributed ledger technology. Hiero is used to build the [Hedera](https://hedera.com/) public ledger.",
  points: [
    {
      heading: "Hiero is **fair**",
      text: "Public forums should be equally accessible. No one should manipulate your transactions to their advantage. Hashgraph is leaderless - toward a fairer world.",
      icon: "/images/Hiero-Icon-Fair.svg",
    },
    {
      heading: "Hiero is **fast**",
      text: "Do not sacrifice performance for fairness or security. As businesses and networks expand rapidly, waiting for transactions to finalize no longer meets your needs. The hashgraph algorithm is fast.",
      icon: "/images/Hiero-Icon-Fast.svg",
    },
    {
      heading: "Hiero is **secure**",
      text: "The hashgraph algorithm is the gold standard - asynchronous Byzantine Fault Tolerant (ABFT). Your transactions are protected with the highest security.",
      icon: "/images/Hiero-Icon-Secure.svg",
    },
    {
      heading: "Hiero is **decentralized**",
      text: "No single entity should control your future. Power is shared among participants with equal access, securing the network and your data. You can participate in its development and use. This network belongs to the world and the future.",
      icon: "/images/Hiero-Icon-Decentralized.svg",
    },
    {
      heading: "Hiero is **leaderless**",
      text: "Leader-based consensus is unfair and either slow or vulnerable to attacks. We believe in a fully leaderless protocol where every node participates equally. Our protocol is resistant to denial-of-service and prevents centralization.",
      icon: "/images/Hiero-Icon-Leaderless.svg",
    },
    {
      heading: "Hiero is **open**",
      text: "Hiero's vibrant community builds a fairer, more efficient, and secure world. As part of the Linux Foundation Decentralized Trust initiative, it pioneers open governance and collaboration.",
      icon: "/images/Hiero-Icon-Open.svg",
    },
  ],
};

const meetData = {
  heading: "Join our Hiero Community Calls",
  text: "Join our open TSC, Community and Project meetings. We welcome your opinion and invite you to collaborate with the team!\n\nRegister to any of our current meeting series [HERE](https://github.com/hiero-ledger#open-community-meetings-and-tsc-schedules)\n\nView all meeting schedules and access recordings via our [LFX Calendar](https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week).",
  calls: [
    {
      name: "TSC",
      description:
        "The Technical Steering Committee (TSC) meeting for project governance, roadmap planning, and key technical decisions.",
      schedule: "Fortnightly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/95775743341?password=c07443bf-b0e6-4a68-93f1-5c7ce9bb49ab&invite=true",
    },
    {
      name: "Community Call",
      description:
        "Open community meeting for general discussions, updates, and Q&A sessions with the Hiero community and TSC members.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/97122675754?password=7eaa865a-2f17-4a7c-97b0-aff51933991c&invite=true",
    },
    {
      name: "Python SDK",
      description:
        "Focused discussions on the Hiero Python SDK development, including new features, issues, and contributions.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/92041330205?password=2f345bee-0c14-4dd5-9883-06fbc9c60581&invite=true",
    },
    {
      name: "Docs",
      description:
        "Documentation working group meetings to improve and maintain Hiero project documentation.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/96247351493?password=54a04164-8618-458d-8176-4ca21b346291&invite=true",
    },
    {
      name: "Solo",
      description:
        "Discussions and updates about Solo, an opinionated CLI tool to deploy and manage standalone test networks.",
      schedule: "Fortnightly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/94695703550?password=e8819002-3f6e-4905-9916-b049f501e866&invite=true",
    },
    {
      name: "Solo Action",
      description:
        "Working sessions focused on Solo Action project development, issues, and contributions.",
      schedule: "Fortnightly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/92576669768?password=8dab94bb-7315-4d37-a944-b1fa0e924741&invite=true",
    },
    {
      name: "SDK",
      description:
        "General SDK working group for cross-SDK discussions, standards, and coordination across all Hiero SDK implementations.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/94709702244?password=bcba4892-928c-47e0-9a21-e1abca95f7d3&invite=true",
    },
    {
      name: "Hiero Website",
      description:
        "Planning and development meetings for the Hiero website, content strategy, and user experience improvements.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/94831465670?password=50e11cd2-6450-4a97-b9ae-7a7585c4409b&invite=true",
    },
    {
      name: "Hiero Marketing",
      description:
        "Marketing and community outreach discussions, including events, communications, and ecosystem growth strategies.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/91725705912?password=57115f71-9576-46dc-90f7-98be38aade2d&invite=true",
    },
    {
      name: "Monthly Maintainers",
      description:
        "Regular meeting for maintainers across all Hiero projects to coordinate, share updates, and discuss best practices.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/99574473075?password=deff3fc9-0e80-4877-80de-91499b5480e9&invite=true",
    },
    {
      name: "Hiero/Hedera Identity",
      description:
        "Working group focused on identity-related projects, DID SDK development, and identity standards implementation.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/99097542854?password=3ee2d9c9-32de-4758-8a23-417c751bd7ab&invite=true",
    },
    {
      name: "Hiero Mirror Node",
      description:
        "Development and maintenance discussions for the Hiero Mirror Node, which archives data from consensus nodes and serves it via an API.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/94618152832?password=3b037576-2aab-4f7e-ab24-acf9ca2c3734&invite=true",
    },
  ],
};

const reposData = {
  heading: "Jump to our Hiero Repositories",
  text: "Explore some of our most active and widely used Hiero repositories.\nThese projects form the core of the Hiero ecosystem.",
  repos: [
    {
      name: "hiero-consensus-node",
      description:
        "Crypto, token, consensus, file, and smart contract services for a Hiero based network",
      link: "https://github.com/hiero-ledger/hiero-consensus-node",
    },
    {
      name: "hiero-local-node",
      description:
        "Run your own local Hiero based network for development purposes",
      link: "https://github.com/hiero-ledger/hiero-local-node",
    },
    {
      name: "hiero-mirror-node",
      description:
        "Archives data from consensus nodes and serves it via an API",
      link: "https://github.com/hiero-ledger/hiero-mirror-node",
    },
    {
      name: "hiero-improvement-proposals",
      description:
        "Hiero Improvement Proposal repository for community-driven enhancements",
      link: "https://github.com/hiero-ledger/hiero-improvement-proposals",
    },
    {
      name: "hiero-sdk-js",
      description:
        "JavaScript/TypeScript SDK for interacting with a Hiero network",
      link: "https://github.com/hiero-ledger/hiero-sdk-js",
    },
    {
      name: "hiero-sdk-java",
      description: "Java SDK for Hiero distributed ledger technology",
      link: "https://github.com/hiero-ledger/hiero-sdk-java",
    },
    {
      name: "hiero-json-rpc-relay",
      description: "Implementation of Ethereum JSON-RPC APIs for Hedera",
      link: "https://github.com/hiero-ledger/hiero-json-rpc-relay",
    },
    {
      name: "hiero-sdk-go",
      description: "Go SDK for Hiero distributed ledger technology",
      link: "https://github.com/hiero-ledger/hiero-sdk-go",
    },
    {
      name: "hiero-sdk-rust",
      description: "The Hiero Rust SDK for building on Hiero networks",
      link: "https://github.com/hiero-ledger/hiero-sdk-rust",
    },
    {
      name: "hiero-mirror-node-explorer",
      description: "Hedera Mirror Node Explorer for the Hedera Hashgraph DLT",
      link: "https://github.com/hiero-ledger/hiero-mirror-node-explorer",
    },
    {
      name: "hiero-cli",
      description: "Hiero command line tools for developers",
      link: "https://github.com/hiero-ledger/hiero-cli",
    },
    {
      name: "solo",
      description:
        "An opinionated CLI tool to deploy and manage standalone test networks",
      link: "https://github.com/hiero-ledger/solo",
    },
    {
      name: "hiero-block-node",
      description: "New Block Node services for Hiero networks",
      link: "https://github.com/hiero-ledger/hiero-block-node",
    },
    {
      name: "hiero-sdk-tck",
      description:
        "Technology Compatibility Kit used to verify compliant implementations of a Hiero SDK",
      link: "https://github.com/hiero-ledger/hiero-sdk-tck",
    },
    {
      name: "hiero-sdk-cpp",
      description:
        "A C++ SDK for Hiero: A C++ toolkit for creating and interacting with on-ledger assets",
      link: "https://github.com/hiero-ledger/hiero-sdk-cpp",
    },
    {
      name: "governance",
      description:
        "Configuration repository for managing all Hiero GitHub repositories",
      link: "https://github.com/hiero-ledger/governance",
    },
    {
      name: "hiero-sdk-python",
      description:
        "A Python SDK for Hiero: A Python toolkit for interacting with on-ledger assets",
      link: "https://github.com/hiero-ledger/hiero-sdk-python",
    },
    {
      name: "hiero-sdk-swift",
      description:
        "A Swift SDK for Hiero: A Swift toolkit for creating and interacting with on-ledger assets",
      link: "https://github.com/hiero-ledger/hiero-sdk-swift",
    },
    {
      name: "sdk-collaboration-hub",
      description:
        "Collaboration hub for SDK-related discussions and coordination",
      link: "https://github.com/hiero-ledger/sdk-collaboration-hub",
    },
    {
      name: "tsc",
      description:
        "Technical Steering Committee activity, discussions and decisions repository",
      link: "https://github.com/hiero-ledger/tsc",
    },
  ],
};

const BASE_QUERY =
  "is%3Aopen%20is%3Aissue%20org%3Ahiero-ledger%20archived%3Afalse%20no%3Aassignee";

const issueJumpData = {
  heading: "Jump to Open Issues",
  text: "Find issues that match your skill level and start contributing to the Hiero ecosystem today.",
  difficulties: [
    {
      label: "Good First Issue",
      description: "Ideal for first-time contributors new to the project.",
      href: `https://github.com/issues?q=${BASE_QUERY}%20(label%3A%22good%20first%20issue%22%20OR%20label%3A%22skill%3A%20good%20first%20issue%22)`,
    },
    {
      label: "Beginner",
      description: "Straightforward tasks that need light domain knowledge.",
      href: `https://github.com/issues?q=${BASE_QUERY}%20(label%3Abeginner%20OR%20label%3A%22skill%3A%20beginner%22)`,
    },
    {
      label: "Intermediate",
      description:
        "Moderately complex issues for developers gaining experience.",
      href: `https://github.com/issues?q=${BASE_QUERY}%20(label%3Aintermediate%20OR%20label%3A%22skill%3A%20intermediate%22)`,
    },
    {
      label: "Advanced",
      description: "Challenging issues requiring deep technical expertise.",
      href: `https://github.com/issues?q=${BASE_QUERY}%20(label%3Aadvanced%20OR%20label%3A%22skill%3A%20advanced%22)`,
    },
  ],
};

const openSourceData = {
  whyHeading: "Why is Hiero Open Source?",
  whyText:
    "The goal of Hiero is to build a diverse community of developers and innovators making the world fairer, faster, and more secure. Hiero's source is accessible so anyone can advance the project. As a decentralized network used by enterprises and critical infrastructure, it must remain vendor-neutral and fully auditable.",
  whatHeading: "What parts of Hiero are Open Source?",
  whatText:
    "Hiero is fully open source. While its transition to Linux Foundation Decentralized Trust continues, additional contributions are available in [Hedera’s GitHub organization](https://github.com/hashgraph). The technical steering committee (TSC) of Hiero will initially oversee adding projects needed for an enterprise-ready decentralized network to a new Hiero GitHub organization. See the roadmap for more details.",
};

const quotesData = [
  {
    quote:
      "\u201cHedera's participation in Linux Foundation's Decentralized Trust will undoubtedly accelerate development, enhance security, and foster unprecedented collaboration within the Hedera ecosystem, positioning it at the forefront of blockchain innovation. As the leading wallet on the network, HashPack is committed to playing an active role in this new open source structure, and we look forward to [contributing our expertise](https://www.hashpack.app/post/hashpack-on-hedera) to help shape the future of Hedera and the broader decentralized technology landscape.\u201d",
    author: "May Chan, CEO, [HashPack](https://www.hashpack.app/)",
    logo: "/images/Hiero-Logo-HashPack.png",
  },
  {
    quote:
      "\u201cBy contributing its codebase to the Linux Foundation's Decentralized Trust, Hedera is demonstrating the ultimate commitment to open development. As a leading [data infrastructure provider](https://www.hgraph.com/blog/hedera-mirror-node) in the ecosystem, Hgraph is actively dedicated to supporting the Hiero project as it transforms the open source DLT space and empowers the Hedera developer community.\u201d",
    author: "Tyler McDonald, CEO, [Hgraph](https://hgraph.com/)",
    logo: "/images/Hiero-Logo-Hgraph.png",
  },
  {
    quote:
      "\u201cThe HBAR Foundry community is excited to see the contribution of the Hedera software to the Linux Foundation Decentralized Trust project. We're delighted to see Hedera's commitment to growing an independently governed and transparent community with more resources and opportunities to engage and grow the ecosystem.\u201d",
    author:
      "[The HBAR Foundry](https://hbarfoundry.com/), A Community Of Expert Hedera Builders",
    logo: "/images/Hiero-Logo-HbarFoundry.png",
  },
  {
    quote:
      "\u201cHedera's contribution of its codebase to the Linux Foundation's Decentralized Trust initiative is great news for SentX.io. By open-sourcing the Hashgraph technology, Hedera is reinforcing its commitment to innovation and decentralization. We expect this move to boost developer engagement, speed up the adoption of decentralized applications, and attract more retail users, driving growth across the ecosystem.\u201d",
    author:
      "Sam Jimenez & Patr\u00edcia Carapinha, Founders, [SentX.io](http://sentx.io/)",
    logo: "/images/Hiero-Logo-Sentx.png",
  },
  {
    quote:
      "\u201cTransferring ownership of Hedera's codebase to the Linux Foundation Decentralized Trust project is a testament to the power of open collaboration and meritocracy. This landmark initiative will empower developers, entrepreneurs, and enterprises to actively participate in shaping the future of Hedera. We are thrilled to be part of this vibrant ecosystem and look forward to contributing to its growth and success.\u201d",
    author: "Ivan Saiz, CTO, [ioBuilders](https://io.builders/)",
    logo: "/images/Hiero-Logo-ioBuilders.png",
  },
  {
    quote:
      "\u201cHedera's contribution of its codebase to the Linux Foundation's Decentralized Trust entirely reshapes decentralized governance. At Calaxy, we view this as more than an infrastructure change - it's a move that drives real-world innovation. Developers now have greater autonomy and access to tools to build more inclusive, user-driven applications. We're excited to see how this enables devs to push the boundaries of creator-focused economies and further integrate blockchain into our everyday social experiences and relationships.\u201d",
    author: "Solo Ceesay, CEO & Co-founder, [Calaxy](https://calaxy.com/)",
    logo: "/images/Hiero-Logo-Calaxy.png",
  },
  {
    quote:
      "\u201cHedera's decision to open-source its codebase under the Linux Foundation Decentralized Trust is a monumental leap forward for the entire blockchain industry. This bold move not only underscores Hedera's commitment to decentralization and transparency but also paves the way for unprecedented community-driven innovation. We are excited to collaborate with the growing ecosystem to build a future where the possibilities are limitless.\u201d",
    author:
      "Rajiv Sohal, CTO, [Diamond Standard](https://www.diamondstandard.co/)",
    logo: "/images/Hiero-Logo-DiamondStandard.svg",
  },
  {
    quote:
      "\u201cThis contribution represents a historic moment in the evolution of decentralized networks and is setting a precedent for transparency and collaboration in the blockchain industry. By contributing our codebase to LF Decentralized Trust, as project Hiero, we are reaffirming our commitment to open governance and collaboration. LF Decentralized Trust's mission to advance decentralized systems aligns perfectly with our own goals. We look forward to providing developers with unmatched access to tools and resources, creating an environment where decentralized applications can truly thrive.\u201d",
    author: "Charles Adkins, President, [Hedera](https://hedera.com/)",
    logo: "/images/Hiero-Logo-Hedera.png",
  },
  {
    quote:
      "\u201cBy contributing Hiero to the Linux Foundation, an organization with a long history of supporting open source and open innovation, Hedera demonstrates to Council Members, ecosystem partners, grantees, and the builder community that it is committed to growing the capabilities of its network through transparency and meritocracy.\u201d",
    author:
      "Dr. Leemon Baird, Inventor, Co-founder, & Chief Scientist, [Hashgraph](https://hashgraph.com/)",
    logo: "/images/Hiero-Logo-Hashgraph.png",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection data={heroData} />
      <WhatIsHieroSection data={whatIsHieroData} />
      <Divider /> 
      <IssueJumpSection data={issueJumpData} />
      <Divider />
      <MeetSection data={meetData} />
      <Divider />
      <ReposCarousel data={reposData} />
      <Divider />
     
      <OpenSourceSection data={openSourceData} />
      <Divider />
      <QuotesCarousel data={quotesData} />
    </>
  );
}
