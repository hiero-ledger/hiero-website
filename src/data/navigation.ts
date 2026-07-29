export interface MenuItem {
  name: string;
  href: string;
  external?: boolean;
  newTab?: boolean;
}

/**
 * Declared `as const` so the item names are available as a literal type for
 * `fromMenu` below; `menuItems` re-exports them as plain `MenuItem`s.
 */
const menuItemDefinitions = [
  { name: "Contribute", href: "/#contribute" },
  { name: "Connect", href: "/#connect" },
  { name: "Blog", href: "/blog/" },
  { name: "TSC", href: "/tsc/" },
  { name: "Issue Explorer", href: "/issues/" },
  {
    name: "Calendar",
    href: "https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week",
  },
] as const satisfies readonly MenuItem[];

type MenuItemName = (typeof menuItemDefinitions)[number]["name"];

export const menuItems: MenuItem[] = [...menuItemDefinitions];

export interface SocialLink {
  name: string;
  href: string;
  /** Brand-red icon, for use on light backgrounds. */
  icon: string;
  /** White icon, for use on the charcoal footer. */
  iconOnDark: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/hiero-ledger/",
    icon: "/images/Hiero-Icon-Github.svg",
    iconOnDark: "/images/Hiero-Icon-Github-white.svg",
  },
  {
    name: "Discord",
    href: "https://discord.com/invite/hyperledger",
    icon: "/images/Hiero-Icon-Discord.svg",
    iconOnDark: "/images/Hiero-Icon-Discord-white.svg",
  },
];

export interface AffiliationLogo {
  name: string;
  href: string;
  /**
   * Official full-colour logo. Both marks are black/grey artwork, so the band
   * that renders them has to be a light one.
   */
  logo: string;
  /** Intrinsic dimensions of `logo`, so the aspect ratio is preserved. */
  width: number;
  height: number;
  /** Rendered height; these lockups have very different aspect ratios. */
  className: string;
}

/**
 * The governance lockup shown at the foot of every page: Hiero is hosted by LF
 * Decentralized Trust, which is in turn part of The Linux Foundation.
 */
export const affiliations: AffiliationLogo[] = [
  {
    name: "LF Decentralized Trust",
    href: "https://www.lfdecentralizedtrust.org/projects/hiero",
    logo: "/images/LFDT-Logo-Horizontal-color.svg",
    width: 699,
    height: 39,
    className: "h-3.5 w-auto sm:h-4",
  },
  {
    name: "The Linux Foundation",
    href: "https://www.linuxfoundation.org/",
    logo: "/images/LF-Logo-black.svg",
    width: 150,
    height: 50,
    className: "h-7 w-auto sm:h-8",
  },
];

export interface FooterNavGroup {
  title: string;
  items: MenuItem[];
}

/**
 * Picks header menu items by name so the footer reuses their hrefs instead of
 * restating them. Names are checked against `menuItems` at compile time, so a
 * renamed menu item breaks the build rather than silently dropping a link.
 */
function fromMenu(...names: MenuItemName[]): MenuItem[] {
  return names.flatMap(name => menuItems.filter(item => item.name === name));
}

export const footerNavGroups: FooterNavGroup[] = [
  {
    title: "Project",
    items: [
      ...fromMenu("Blog", "TSC", "Issue Explorer"),
      // { name: "Hiero Heroes", href: "/heroes/" },
    ],
  },
  {
    title: "Community",
    items: [
      ...fromMenu("Contribute", "Connect", "Calendar"),
      {
        name: "Discussions",
        href: "https://github.com/orgs/hiero-ledger/discussions",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        name: "Repositories",
        href: "https://github.com/orgs/hiero-ledger/repositories",
      },
      {
        name: "Technical Charter",
        href: "https://github.com/hiero-ledger/governance/blob/main/hiero-technical-charter.md",
      },
      {
        name: "LF Decentralized Trust",
        href: "https://www.lfdecentralizedtrust.org/projects/hiero",
      },
    ],
  },
];
