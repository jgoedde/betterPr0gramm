import { FC, ReactNode, useMemo, useRef, useState } from "react";
import { PlaybackContext } from "./PlaybackContext.ts";

export const PlaybackProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [shouldPlayAudio, setShouldPlayAudio] = useState(false); // Idea: We could store that in LS.

    const videoRef = useRef<HTMLVideoElement>(null);
    const blurredVideoRef = useRef<HTMLVideoElement>(null);

    const value = useMemo(
        () => ({
            shouldPlayAudio,
            setShouldPlayAudio,
            videoRef,
            blurredVideoRef,
        }),
        [shouldPlayAudio]
    );

    return (
        <PlaybackContext.Provider value={value}>
            {children}
        </PlaybackContext.Provider>
    );
};
