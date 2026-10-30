import type { Playthrough } from "@/types/app";

export interface PlaythroughFormValues {
  name: string;
  description: string;
}

export interface PlaythroughFieldsProps {
  values: PlaythroughFormValues;
  onChange: (patch: Partial<PlaythroughFormValues>) => void;
  showNameError: boolean;
}

export interface PlaythroughCardProps {
  playthrough: Playthrough;
  isActive: boolean;
  onSetActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}
