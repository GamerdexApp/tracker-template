"use client";

import type { ReactNode } from "react";

import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { commonText } from "@/lib/messages/common";
import { PLAYTHROUGHS_HREF } from "@/data/nav";
import { ButtonLink } from "@/comps/ui/Button";
import { EmptyState } from "@/comps/ui/EmptyState";
import type { Playthrough } from "@/types/app";
import { PageHeader } from "./PageHeader";

interface PlaythroughGateProps {
	title: string;
	children: (playthrough: Playthrough) => ReactNode;
}

/** The shell already holds the page until storage is read, so the empty panel shows only with no playthrough. */
export const PlaythroughGate = ({ title, children }: PlaythroughGateProps) => {
	const { activePlaythrough } = usePlaythrough();

	if (!activePlaythrough) {
		return (
			<>
				<PageHeader title={title} />
				<EmptyState
					title={commonText.gate.title}
					description={commonText.gate.description}
					actions={
						<>
							<ButtonLink href={`${PLAYTHROUGHS_HREF}?new=1`} variant="primary">
								{commonText.gate.newPlaythrough}
							</ButtonLink>
							<ButtonLink href={PLAYTHROUGHS_HREF}>
								{commonText.gate.choosePlaythrough}
							</ButtonLink>
						</>
					}
				/>
			</>
		);
	}
	return <>{children(activePlaythrough)}</>;
};
