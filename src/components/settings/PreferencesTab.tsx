"use client";

import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { settingsText } from "@/lib/messages/settings";
import { RadioGroup } from "@/comps/ui/RadioGroup";
import type { ThemeChoice } from "@/types/app";
import { RegionCard } from "./RegionCard";
import { SettingsCard } from "./SettingsCard";

const text = settingsText;
const THEMES: ThemeChoice[] = ["light", "dark", "system"];
const themeOptions = () => THEMES.map((id) => ({ id, label: text.appearance.themes[id] }));

const Appearance = () => {
	const { appSettings, updateSettings } = usePlaythrough();
	const systemIsDark = useMediaQuery("(prefers-color-scheme: dark)");

	return (
		<SettingsCard title={text.appearance.title} description={text.appearance.description}>
			<RadioGroup
				label={text.appearance.themeLabel}
				options={themeOptions()}
				value={appSettings.theme ?? "system"}
				onChange={(theme) => updateSettings({ theme })}
			/>
			<p className="text-muted">{text.appearance.themeNote(systemIsDark ? "dark" : "light")}</p>
		</SettingsCard>
	);
};

export const PreferencesTab = () => (
	<div className="grid items-start gap-4 lg:grid-cols-2">
		<Appearance />
		<RegionCard />
	</div>
);
