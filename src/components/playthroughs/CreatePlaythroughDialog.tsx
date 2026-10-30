"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { playthroughsText } from "@/lib/messages/playthroughs";
import { createDefaultGameData } from "@/service/items";
import { Button } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { SwitchRow } from "@/comps/ui/Switch";
import { useToast } from "@/comps/ui/Toast";
import type { PlaythroughFormValues } from "@/types/components/playthroughs";
import { PlaythroughFields } from "./PlaythroughFields";

const text = playthroughsText.create;
const emptyValues: PlaythroughFormValues = { name: "", description: "" };

const CreateDialogContent = ({ onClose }: { onClose: () => void }) => {
	const formId = useId();
	const { addPlaythrough } = usePlaythrough();
	const showToast = useToast();
	const [values, setValues] = useState(emptyValues);
	const [makeActive, setMakeActive] = useState(true);
	const [showError, setShowError] = useState(false);

	const name = values.name.trim();

	const submit = (event: FormEvent) => {
		event.preventDefault();
		if (name === "") {
			setShowError(true);
			return;
		}
		const id = addPlaythrough(
			{ name, description: values.description.trim() || undefined, data: createDefaultGameData() },
			{ makeActive },
		);
		if (!id) return;
		showToast({ variant: "success", title: text.done(name) });
		onClose();
	};

	return (
		<Dialog
			open
			onClose={onClose}
			title={text.title}
			footer={
				<>
					<Button onClick={onClose}>{playthroughsText.fields.cancel}</Button>
					<Button type="submit" form={formId} variant="primary" aria-disabled={name === ""}>
						{text.submit}
					</Button>
				</>
			}
		>
			<form id={formId} onSubmit={submit} noValidate className="flex flex-col gap-4">
				<PlaythroughFields
					values={values}
					onChange={(patch) => setValues((current) => ({ ...current, ...patch }))}
					showNameError={showError}
				/>
				<SwitchRow label={text.makeActive} checked={makeActive} onChange={setMakeActive} />
			</form>
		</Dialog>
	);
};

export const CreatePlaythroughDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) =>
	open ? <CreateDialogContent onClose={onClose} /> : null;
