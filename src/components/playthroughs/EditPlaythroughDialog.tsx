"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { playthroughsText } from "@/lib/messages/playthroughs";
import { Button } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { useToast } from "@/comps/ui/Toast";
import type { Playthrough } from "@/types/app";
import type { PlaythroughFormValues } from "@/types/components/playthroughs";
import { PlaythroughFields } from "./PlaythroughFields";

const text = playthroughsText.edit;

const initialValues = (playthrough: Playthrough): PlaythroughFormValues => ({
	name: playthrough.name,
	description: playthrough.description ?? "",
});

const EditDialogContent = ({ playthrough, onClose }: { playthrough: Playthrough; onClose: () => void }) => {
	const formId = useId();
	const { updatePlaythrough } = usePlaythrough();
	const showToast = useToast();
	const [values, setValues] = useState(() => initialValues(playthrough));
	const [showError, setShowError] = useState(false);

	const name = values.name.trim();

	const submit = (event: FormEvent) => {
		event.preventDefault();
		if (name === "") {
			setShowError(true);
			return;
		}
		updatePlaythrough(playthrough.id, { name, description: values.description.trim() || undefined });
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
			</form>
		</Dialog>
	);
};

export const EditPlaythroughDialog = ({
	playthrough,
	onClose,
}: {
	playthrough: Playthrough | null;
	onClose: () => void;
}) => (playthrough ? <EditDialogContent playthrough={playthrough} onClose={onClose} /> : null);
