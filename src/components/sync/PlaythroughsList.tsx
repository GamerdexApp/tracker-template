"use client";

import type { Playthrough } from "@/types/app";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { useSync } from "@/lib/contexts/SyncContext";
import { formatDateTime } from "@/lib/format";
import { playthroughsText } from "@/lib/messages/playthroughs";
import { syncText } from "@/lib/messages/sync";
import { fromSyncShape } from "@/lib/sync/shape";
import { itemProgress } from "@/service/items";
import { Badge } from "@/comps/ui/Badge";
import { Button } from "@/comps/ui/Button";

const text = syncText.playthroughs;

const tones = {
	synced: "kept",
	changedHere: "changed",
	conflict: "warn",
	newHere: "changed",
} as const;

type PlaythroughStatus = keyof typeof tones;

const statusOf = (
	playthrough: Playthrough,
	cloud: Playthrough | undefined,
	hasConflict: boolean
): PlaythroughStatus => {
	if (hasConflict) return "conflict";
	if (!cloud) return "newHere";
	return JSON.stringify(playthrough) === JSON.stringify(cloud) ? "synced" : "changedHere";
};

const Describe = ({ playthrough }: { playthrough: Playthrough }) => {
	const { done, total } = itemProgress(playthrough);
	return (
		<>
			<span>{playthroughsText.card.progress(done, total)}</span>
			<span className="text-muted font-mono text-xs">
				{formatDateTime(playthrough.lastModified)}
			</span>
		</>
	);
};

export const PlaythroughsList = ({ onReview }: { onReview: () => void }) => {
	const { playthroughs } = usePlaythrough();
	const { cloudCopy, conflicts } = useSync();
	const cloudPlaythroughs = cloudCopy ? fromSyncShape(cloudCopy).playthroughs : [];

	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-base font-semibold">{text.title}</h3>
			<ul className="flex flex-col gap-3">
				{playthroughs.map((playthrough) => {
					const cloud = cloudPlaythroughs.find((other) => other.id === playthrough.id);
					const hasConflict = conflicts.some(
						(conflict) =>
							conflict.path[0] === "playthroughs" &&
							conflict.path[1] === playthrough.id
					);
					const current = statusOf(playthrough, cloud, hasConflict);
					return (
						<li
							key={playthrough.id}
							className="border-line bg-surface flex flex-col gap-2 rounded-md border-[1.5px] p-3"
						>
							<div className="flex items-start justify-between gap-3">
								<span className="font-semibold">{playthrough.name}</span>
								<Badge tone={tones[current]}>{text.status[current]}</Badge>
							</div>
							<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
								<dt className="text-muted">{text.thisDevice}</dt>
								<dd className="flex flex-col items-end text-end">
									<Describe playthrough={playthrough} />
								</dd>
								<dt className="text-muted">{text.cloud}</dt>
								<dd className="flex flex-col items-end text-end">
									{cloud ? (
										<Describe playthrough={cloud} />
									) : (
										<span className="text-muted">{text.notInCloud}</span>
									)}
								</dd>
							</dl>
							{current === "conflict" && (
								<div>
									<Button variant="link" onClick={onReview}>
										{text.review}
									</Button>
								</div>
							)}
						</li>
					);
				})}
			</ul>
			<p className="text-muted">{text.note}</p>
		</div>
	);
};
