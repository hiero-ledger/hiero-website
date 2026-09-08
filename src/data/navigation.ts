export interface MenuItem {
  name: string;
  href: string;
  external?: boolean;
  newTab?: boolean;
}

/** Anything absolute leaves the site unless the item says otherwise. */
export function isExternalLink(item: MenuItem): boolean {
  return item.external ?? item.href.startsWith("http");
}

/** External links open in a new tab unless the item opts out. */
export function opensInNewTab(item: MenuItem): boolean {
  return item.newTab ?? isExternalLink(item);
}

/**
 * Warning appended to the accessible name of a link that opens in a new tab,
 * so screen reader users get what the `↗` glyph gives sighted users. It has to
 * ride on `aria-label`: the name algorithm joins inline elements without a
 * separator, so a visually hidden span comes out jammed against the link text.
 */
export const newTabHintText = "(opens in a new tab)";

export function withNewTabHint(name: string): string {
  return `${name} ${newTabHintText}`;
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

/**
 * Named as a union so components sizing these logos can be checked for
 * exhaustiveness — adding an affiliation then breaks the build rather than
 * rendering an unsized image.
 */
export type AffiliationName = "LF Decentralized Trust" | "The Linux Foundation";

export interface AffiliationLogo {
  name: AffiliationName;
  href: string;
  /**
   * Official full-colour logo. Both marks are black/grey artwork, so the band
   * that renders them has to be a light one.
   */
  logo: string;
  /** Intrinsic dimensions of `logo`, so the aspect ratio is preserved. */
  width: number;
  height: number;
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
  },
  {
    name: "The Linux Foundation",
    href: "https://www.linuxfoundation.org/",
    logo: "/images/LF-Logo-black.svg",
    width: 150,
    height: 50,
  },
];

export interface FooterNavGroup {
  title: string;
  items: MenuItem[];
}

const menuItemsByName = Object.fromEntries(
  menuItemDefinitions.map(item => [item.name, item]),
) as Record<MenuItemName, MenuItem>;

/**
 * Picks header menu items by name so the footer reuses their hrefs instead of
 * restating them. Names are checked against `menuItems` at compile time, so a
 * renamed menu item breaks the build rather than silently dropping a link.
 */
function fromMenu(...names: MenuItemName[]): MenuItem[] {
  return names.map(name => menuItemsByName[name]);
}

export const footerNavGroups: FooterNavGroup[] = [
  {
    title: "Project",
    items: fromMenu("Blog", "TSC", "Issue Explorer"),
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
