"use client";

import { playthroughsText } from "@/lib/messages/playthroughs";
import { Field } from "@/comps/ui/Field";
import { Input } from "@/comps/ui/Input";
import { Textarea } from "@/comps/ui/Textarea";
import type { PlaythroughFieldsProps } from "@/types/components/playthroughs";

const text = playthroughsText.fields;

export const PlaythroughFields = ({ values, onChange, showNameError }: PlaythroughFieldsProps) => (
	<>
		<Field label={text.name} error={showNameError ? text.nameRequired : undefined}>
			<Input
				data-autofocus
				value={values.name}
				placeholder={text.namePlaceholder}
				onChange={(event) => onChange({ name: event.target.value })}
			/>
		</Field>
		<Field label={text.description} optional>
			<Textarea
				value={values.description}
				placeholder={text.descriptionPlaceholder}
				rows={2}
				onChange={(event) => onChange({ description: event.target.value })}
			/>
		</Field>
	</>
);
