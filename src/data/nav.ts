import type { IconType } from "react-icons";
import { LuLayoutDashboard, LuListChecks, LuSettings } from "react-icons/lu";

import { navText } from "@/lib/messages/nav";

export const APP_NAME = "Game Name Tracker";
export const HOME_HREF = "/";
export const PLAYTHROUGHS_HREF = "/playthroughs";
export const SYNC_HREF = "/settings?tab=sync";

export interface NavItem {
  href: string;
  label: string;
  icon: IconType;
}

export const navItems: NavItem[] = [
  {
    href: "/overview",
    get label() {
      return navText.items.overview;
    },
    icon: LuLayoutDashboard,
  },
  {
    href: "/items",
    get label() {
      return navText.items.items;
    },
    icon: LuListChecks,
  },
];

export const settingsNavItem: NavItem = {
  href: "/settings",
  get label() {
    return navText.items.settings;
  },
  icon: LuSettings,
};

export const allNavItems: NavItem[] = [...navItems, settingsNavItem];

export const isNavItemActive = (item: NavItem, pathname: string) =>
  pathname === item.href || pathname.startsWith(`${item.href}/`);

export const getPageTitle = (pathname: string) =>
  allNavItems.find((item) => isNavItemActive(item, pathname))?.label ??
  (pathname === PLAYTHROUGHS_HREF ? navText.playthroughs : undefined) ??
  APP_NAME;
