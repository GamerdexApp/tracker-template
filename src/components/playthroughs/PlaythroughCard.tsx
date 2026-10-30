"use client";

import { useId } from "react";

import { playthroughsText } from "@/lib/messages/playthroughs";
import { formatDate } from "@/lib/format";
import { itemProgress } from "@/service/items";
import { Badge } from "@/comps/ui/Badge";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { ProgressBar } from "@/comps/ui/ProgressBar";
import type { PlaythroughCardProps } from "@/types/components/playthroughs";

const text = playthroughsText.card;

export const PlaythroughCard = ({ playthrough, isActive, onSetActive, onEdit, onDelete }: PlaythroughCardProps) => {
	const titleId = useId();
	const { done, total } = itemProgress(playthrough);

	return (
		<Card role="group" aria-labelledby={titleId} highlighted={isActive} className="flex flex-col gap-3 p-4">
			<div className="flex items-start justify-between gap-3">
				<h2 id={titleId} className="truncate text-lg font-semibold">
					{playthrough.name}
				</h2>
				{isActive && <Badge tone="kept">{text.active}</Badge>}
			</div>
			{playthrough.description && <p className="text-muted">{playthrough.description}</p>}
			<div className="flex flex-col gap-1.5">
				<span className="text-muted text-xs">{text.progress(done, total)}</span>
				<ProgressBar value={total === 0 ? 0 : done / total} label={text.progress(done, total)} />
			</div>
			<p className="text-muted flex flex-col text-xs">
				<span>{text.created(formatDate(playthrough.createdAt))}</span>
				<span>{text.lastModified(formatDate(playthrough.lastModified))}</span>
			</p>
			<div className="flex flex-wrap gap-2">
				{isActive ? (
					<ButtonLink href="/overview" variant="primary" className="max-sm:basis-full sm:flex-1">
						{text.openOverview}
					</ButtonLink>
				) : (
					<Button variant="primary" className="max-sm:basis-full sm:flex-1" onClick={onSetActive}>
						{text.setActive}
					</Button>
				)}
				<Button className="max-sm:flex-1" onClick={onEdit}>
					{text.edit}
				</Button>
				<Button variant="danger" className="max-sm:flex-1" onClick={onDelete}>
					{text.delete}
				</Button>
			</div>
		</Card>
	);
};
