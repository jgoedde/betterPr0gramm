import { createContext } from "react";

export type PlaybackContext = {
    shouldPlayAudio: boolean;
    setShouldPlayAudio: (val: boolean) => void;
};
export const PlaybackContext = createContext<PlaybackContext | null>(null);
