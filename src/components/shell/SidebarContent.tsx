"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { shellText } from "@/lib/messages/shell";
import type { NavItem } from "@/data/nav";
import { isNavItemActive, navItems, settingsNavItem } from "@/data/nav";
import { BrandMark } from "./BrandMark";
import { PlaythroughSwitcher } from "./PlaythroughSwitcher";

interface SidebarLinkProps {
	item: NavItem;
	onNavigate?: () => void;
}

const SidebarLink = ({ item, onNavigate }: SidebarLinkProps) => {
	const active = isNavItemActive(item, usePathname());
	const Icon = item.icon;

	return (
		<Link
			href={item.href}
			onClick={onNavigate}
			aria-current={active ? "page" : undefined}
			className={`flex h-10 items-center gap-2.5 rounded-md px-2.5 lg:h-9 ${
				active
					? "bg-sb-active-bg text-sb-active-text focus-visible:outline-sb-active-text font-semibold"
					: "text-sb-text hover:bg-sb-line"
			}`}
		>
			<Icon size={16} aria-hidden="true" className="shrink-0" />
			<span className="flex-1">{item.label}</span>
		</Link>
	);
};

export const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
	<div className="flex min-h-0 flex-1 flex-col gap-4 [--ring:var(--color-sb-ring)]">
		<BrandMark onNavigate={onNavigate} />
		<PlaythroughSwitcher onNavigate={onNavigate} />
		<nav
			aria-label={shellText.mainNav}
			data-focus-inset
			className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto"
		>
			{navItems.map((item) => (
				<SidebarLink key={item.href} item={item} onNavigate={onNavigate} />
			))}
		</nav>
		<div data-focus-inset className="border-sb-line border-t-[1.5px] pt-3">
			<SidebarLink item={settingsNavItem} onNavigate={onNavigate} />
		</div>
	</div>
);
