import type { Metadata } from "next";

import { SettingsPage } from "@/comps/settings/SettingsPage";

export const metadata: Metadata = {
	title: "Settings",
	description:
		"Export, import or reset your tracker data, connect cloud sync and choose a theme and a language.",
	alternates: { canonical: "/settings" },
};

const Page = () => <SettingsPage />;
export default Page;
