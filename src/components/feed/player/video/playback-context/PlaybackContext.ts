import { createContext, RefObject } from "react";

export type PlaybackContext = {
    shouldPlayAudio: boolean;
    setShouldPlayAudio: (val: boolean) => void;
    videoRef: RefObject<HTMLVideoElement>;
    blurredVideoRef: RefObject<HTMLVideoElement>;
};
export const PlaybackContext = createContext<PlaybackContext | null>(null);
