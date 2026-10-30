"use client";

import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { useItemActions } from "@/lib/hooks/useItemActions";
import { itemsText } from "@/lib/messages/items";
import { uiText } from "@/lib/messages/ui";
import { isAtTopLevel, itemProgress, itemsOf } from "@/service/items";
import { PageHeader } from "@/comps/shell/PageHeader";
import { PlaythroughGate } from "@/comps/shell/PlaythroughGate";
import { Badge } from "@/comps/ui/Badge";
import { Card } from "@/comps/ui/Card";
import { EmptyState } from "@/comps/ui/EmptyState";
import { NumberStepper } from "@/comps/ui/NumberStepper";
import { ProgressBar } from "@/comps/ui/ProgressBar";
import { SwitchRow } from "@/comps/ui/Switch";
import type { Playthrough } from "@/types/app";

const text = itemsText;

const ItemsList = ({ playthrough }: { playthrough: Playthrough }) => {
	const { appSettings, updateSettings } = usePlaythrough();
	const { setLevel } = useItemActions();
	const hideDone = appSettings.ui?.hideDone ?? false;
	const { done, total } = itemProgress(playthrough);
	const entries = itemsOf(playthrough).filter((entry) => !hideDone || !isAtTopLevel(entry));

	return (
		<>
			<PageHeader title={text.title} subline={text.subline(done, total)} />
			<Card className="p-4">
				<SwitchRow
					label={text.hideDone}
					checked={hideDone}
					onChange={(checked) => updateSettings({ ui: { ...appSettings.ui, hideDone: checked } })}
				/>
			</Card>
			{entries.length === 0 ? (
				<EmptyState title={text.empty.title} description={text.empty.description} />
			) : (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{entries.map((entry) => {
						const { definition, level } = entry;
						return (
							<Card key={definition.id} className="flex flex-col gap-3 p-4">
								<div className="flex items-start justify-between gap-3">
									<h2 className="font-semibold">{definition.name}</h2>
									{isAtTopLevel(entry) && <Badge tone="kept">{text.topLevel}</Badge>}
								</div>
								<span className="text-muted font-mono text-xs">{text.levelOf(level, definition.maxLevel)}</span>
								<ProgressBar value={level / definition.maxLevel} label={text.levelLabel(definition.name)} />
								<NumberStepper
									value={level}
									label={uiText.stepper.labelPrefix(text.levelLabel(definition.name))}
									lowerLabel={uiText.stepper.lower(definition.name)}
									raiseLabel={uiText.stepper.raise(definition.name)}
									step={1}
									min={0}
									max={definition.maxLevel}
									onChange={(next) => setLevel(playthrough.id, definition.id, next)}
								/>
							</Card>
						);
					})}
				</div>
			)}
		</>
	);
};

export const ItemsPage = () => (
	<PlaythroughGate title={text.title}>{(playthrough) => <ItemsList playthrough={playthrough} />}</PlaythroughGate>
);
