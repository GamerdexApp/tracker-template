import type { Metadata } from "next";

import { OverviewPage } from "@/comps/overview/OverviewPage";

export const metadata: Metadata = {
	title: "Overview",
	description: "See your playthrough at a glance: items at their top level and the levels you reached.",
	alternates: { canonical: "/overview" },
};

const Page = () => <OverviewPage />;
export default Page;
