import communityCalls from "@/data/community_calls.json";
import organizationStats from "@/data/organization_stats.json";
import trackedRepositories from "@/data/tracked_repositories.json";
import { normaliseCallName } from "@/lib/community-calls";

const githubOrganizationUrl = `https://github.com/${trackedRepositories.organization}`;

export const whatIsHieroData = {
  eyebrow: "Principles",
  heading: "What is Hiero?",
  text: "Hiero, a [Linux Foundation Decentralized Trust](https://www.lfdecentralizedtrust.org/) project, is an open-source, vendor-neutral distributed ledger technology. Hiero is used to build networks like [Hedera](https://hedera.com/).",
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

// Editorial overrides for the community calls, keyed by LFX meeting ID.
//
// Order, registration links and cadence come from src/data/community_calls.json,
// which `pnpm sync:community-calls` regenerates from the LFX calendar API. Names
// are derived from the calendar title by normaliseCallName, so a rename upstream
// reaches the site on the next build.
//
// Only list a name here when normalisation cannot get it right. Descriptions are
// editorial: without one, the card falls back to the calendar's own agenda.
const callOverrides: Record<string, { name?: string; description?: string }> = {
  "95775743341": {
    description:
      "The Technical Steering Committee (TSC) meeting for project governance, roadmap planning, and key technical decisions.",
  },
  "99574473075": {
    description:
      "Regular meeting for maintainers across all Hiero projects to coordinate, share updates, and discuss best practices.",
  },
  "97122675754": {
    description:
      "Open community meeting for general discussions, updates, and Q&A sessions with the Hiero community and TSC members.",
  },
  "94709702244": {
    description:
      "General SDK working group for cross-SDK discussions, standards, and coordination across all Hiero SDK implementations.",
  },
  "99097542854": {
    description:
      "Working group focused on identity-related projects, DID SDK development, and identity standards implementation.",
  },
  "92041330205": {
    description:
      "Roadmap, features, blockers, and contributions for the Hiero Python SDK.",
  },
  "94695703550": {
    description:
      "Discussions and updates about Solo, an opinionated CLI tool to deploy and manage standalone test networks.",
  },
  "98394707679": {
    description:
      "Good first issues, mentorship, growing the maintainer base, and hackathons across the Hiero community.",
  },
  "92576669768": {
    description:
      "Working sessions focused on Solo Action project development, issues, and contributions.",
  },
  "99912667426": {
    // The calendar says "SDK Python" here but "Python SDK" on the sibling
    // community call. Align the two so the pair reads as one series.
    name: "Python SDK Office Hours",
    description:
      "Open Q&A and hands-on help from maintainers, for newcomers and existing contributors to the Hiero Python SDK.",
  },
  "99434549287": {
    description:
      "Strategy and planning for supporting the good first issue pipelines at Hiero.",
  },
  "94618152832": {
    description:
      "Community group for all consumers of block streams, covering block nodes and mirror nodes.",
  },
  "99471977018": {
    description:
      "Working group on shifting agent security to a post-quantum cryptographic baseline and verifiable regulatory compliance.",
  },
  "96385796810": {
    description:
      "Subcommittee facilitating working groups for agentic trust scores, adapters, registries, and related standards.",
  },
};

// Meeting IDs to keep off the site even while they remain on the LFX calendar.
const hiddenCallIds = new Set<string>([]);

export const meetData = {
  heading: "Join our Hiero Community Calls",
  text: "Join our open meetings to collaborate with the team. [Register here](https://github.com/hiero-ledger#open-community-meetings-and-tsc-schedules) or view schedules on the [LFX Calendar](https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week).",
  // Already sorted by sign-up count, highest first.
  calls: communityCalls
    .filter(call => !hiddenCallIds.has(call.meetingId))
    .map(call => ({
      name: callOverrides[call.meetingId]?.name ?? normaliseCallName(call.name),
      description: callOverrides[call.meetingId]?.description ?? call.agenda,
      cadence: call.cadence,
      registerLink: call.registerLink,
    })),
};

export const reposData = {
  heading: "Jump to our Hiero Repositories",
  text: "Explore some of our most active and widely used Hiero repositories.\nThese projects form the core of the Hiero ecosystem.",
  // One source of truth with the stats sync: tracked_repositories.json also
  // drives src/scripts/sync-repo-stats.mjs, so the grid and its star badges
  // can never track different repo sets.
  repos: trackedRepositories.repositories.map(repository => ({
    ...repository,
    link: `${githubOrganizationUrl}/${repository.name}`,
  })),
};

// Fix: replaced org:hiero-ledger with specific repo: filters
// to only include active repos (python sdk, c++ sdk, website, swift sdk ,js sdk). (fixes #411)
const BASE_QUERY =
  "is%3Aopen%20is%3Aissue%20archived%3Afalse%20no%3Aassignee%20(repo%3Ahiero-ledger%2Fhiero-sdk-python%20OR%20repo%3Ahiero-ledger%2Fhiero-sdk-cpp%20OR%20repo%3Ahiero-ledger%2Fhiero-website%20OR%20repo%3Ahiero-ledger%2Fhiero-sdk-swift%20OR%20repo%3Ahiero-ledger%2Fhiero-sdk-js)";

export const issueJumpData = {
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

export const quotesData = [
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
    author: "The HBAR Foundry, A Community Of Expert Hedera Builders",
    logo: "/images/Hiero-Logo-HbarFoundry.png",
  },
  {
    quote:
      "\u201cHedera's contribution of its codebase to the Linux Foundation's Decentralized Trust initiative is great news for SentX.io. By open-sourcing the Hashgraph technology, Hedera is reinforcing its commitment to innovation and decentralization. We expect this move to boost developer engagement, speed up the adoption of decentralized applications, and attract more retail users, driving growth across the ecosystem.\u201d",
    author:
      "Sam Jimenez & Patr\u00edcia Carapinha, Founders, [SentX.io](https://sentx.io/)",
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

/**
 * Declared last rather than first: the hero's colophon counts the community
 * calls defined above, so it has to be evaluated after them.
 *
 * All three counts are live. `organization_stats.json` (one GitHub listing of
 * every public hiero-ledger repository — so the repo count and star sum can
 * never describe different repo sets) and `community_calls.json` are
 * regenerated by `pnpm sync:data` on every dev run and build. The per-repo
 * `repository_stats.json` still backs the repository grid; a test in
 * `__tests__/homePageData.test.ts` keeps its list in step with
 * `reposData.repos`.
 */
export const heroData = {
  eyebrow: "A Linux Foundation Decentralized Trust project",
  heading: "Hiero",
  lede: "Open-source, vendor-neutral distributed ledger technology, developed in the open and used to build networks including the Hedera public network.",
  actions: [
    { name: "Start contributing", href: "/#contribute" },
    { name: "Browse the code", href: `${githubOrganizationUrl}/` },
  ],
  facts: [
    {
      value: String(organizationStats.publicRepositories),
      label: "Total repositories",
    },
    {
      // Explicit locale so the separator is the same in Node at build time and
      // in every reader's browser.
      value: organizationStats.totalStars.toLocaleString("en-US"),
      label: "GitHub stars",
    },
    {
      value: String(meetData.calls.length),
      label: "Community calls",
    },
  ],
};
