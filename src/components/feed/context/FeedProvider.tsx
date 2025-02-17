import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import {
    FeedContext,
    IFeedContext,
} from "@/components/feed/context/FeedContext.ts";

export const FeedProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [currentFeedIndex, setCurrentFeedIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [currentUploadId, setCurrentUploadId] = useState<number>();
    const [isPlaying, setIsPlaying] = useState(true);

    const mute = useCallback(() => {
        setIsMuted(true);
    }, []);

    const unmute = useCallback(() => {
        setIsMuted(false);
    }, []);

    const pause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const play = useCallback(async () => {
        setIsPlaying(true);
    }, []);

    const value: IFeedContext = useMemo(() => {
        return {
            currentFeedIndex,
            mute,
            pause,
            play,
            unmute,
            isMuted,
            currentUploadId,
            isPlaying,
            setCurrentFeedIndex,
            setCurrentUploadId,
        };
    }, [
        currentFeedIndex,
        currentUploadId,
        isMuted,
        isPlaying,
        mute,
        pause,
        play,
        unmute,
    ]);

    return (
        <FeedContext.Provider value={value}>{children}</FeedContext.Provider>
    );
};
