import { FC, ReactNode, useMemo, useState } from "react";
import { PlaybackContext } from "./PlaybackContext";

export const PlaybackProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [shouldPlayAudio, setShouldPlayAudio] = useState(false); // Idea: We could store that in LS.
    const [shouldShowCaptions] = useState(false);

    const value = useMemo(() => {
        return {
            shouldPlayAudio,
            shouldShowCaptions,
            setShouldPlayAudio,
        };
    }, [shouldPlayAudio, shouldShowCaptions]);

    return (
        <PlaybackContext.Provider value={value}>
            {children}
        </PlaybackContext.Provider>
    );
};
