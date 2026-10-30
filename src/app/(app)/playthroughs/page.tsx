import type { Metadata } from "next";

import { PlaythroughsPage } from "@/comps/playthroughs/PlaythroughsPage";

export const metadata: Metadata = {
	title: "My Playthroughs",
	description: "Create, switch, edit and delete your playthroughs.",
	alternates: { canonical: "/playthroughs" },
};

const Page = () => <PlaythroughsPage />;
export default Page;
