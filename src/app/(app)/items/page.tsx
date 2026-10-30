import type { Metadata } from "next";

import { ItemsPage } from "@/comps/items/ItemsPage";

export const metadata: Metadata = {
	title: "Items",
	description: "Track the level of every item in your playthrough.",
	alternates: { canonical: "/items" },
};

const Page = () => <ItemsPage />;
export default Page;
