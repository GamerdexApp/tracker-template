"use client";

import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { overviewText } from "@/lib/messages/overview";
import { itemProgress } from "@/service/items";
import { PageHeader } from "@/comps/shell/PageHeader";
import { PlaythroughGate } from "@/comps/shell/PlaythroughGate";
import { ButtonLink } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { ProgressBar } from "@/comps/ui/ProgressBar";
import { SummaryTile } from "@/comps/ui/SummaryTile";
import type { Playthrough } from "@/types/app";

const text = overviewText;

const OverviewContent = ({ playthrough }: { playthrough: Playthrough }) => {
	const { playthroughs } = usePlaythrough();
	const { done, total, levels, maxLevels } = itemProgress(playthrough);

	return (
		<>
			<PageHeader
				title={text.title}
				subline={text.subline(playthrough.name)}
				actions={<ButtonLink href="/items">{text.open}</ButtonLink>}
			/>
			<Card className="flex flex-col gap-3 p-4">
				<h2 className="font-semibold">{text.progress.title}</h2>
				<ProgressBar value={total === 0 ? 0 : done / total} label={text.progress.title} />
				<span className="text-muted">{text.progress.label(done, total)}</span>
			</Card>
			<div className="grid gap-3 sm:grid-cols-3">
				<SummaryTile label={text.tiles.done} value={done} total={total} />
				<SummaryTile label={text.tiles.levels} value={levels} total={maxLevels} />
				<SummaryTile label={text.tiles.playthroughs} value={playthroughs.length} />
			</div>
		</>
	);
};

export const OverviewPage = () => (
	<PlaythroughGate title={text.title}>{(playthrough) => <OverviewContent playthrough={playthrough} />}</PlaythroughGate>
);
