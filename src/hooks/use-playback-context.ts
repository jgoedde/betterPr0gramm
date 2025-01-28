import { useContext } from "react";
import { PlaybackContext } from "@/components/feed/player/video/playback-context/PlaybackContext.ts";

export function usePlaybackContext() {
    const context = useContext(PlaybackContext);

    if (!context) {
        throw new Error(
            "Cannot consume usePlaybackContext() outside of PlaybackContextProvider"
        );
    }

    return context;
}
