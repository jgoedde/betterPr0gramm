import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import {
    FeedContext,
    IFeedContext,
} from "@/components/feed/context/FeedContext.ts";
import { emitter } from "@/emitter.ts";

export const FeedProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [currentFeedIndex, setCurrentFeedIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [currentUploadId, setCurrentUploadId] = useState<number>();
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState<number>();
    const [videoLengthSeconds, setVideoLengthSeconds] = useState<number>();

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

    const jumpToSecond: IFeedContext["jumpToSecond"] = useCallback((sec) => {
        emitter.emit("seekbar-let-go", { seconds: sec });

        setCurrentTime(sec);
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
            videoLengthSeconds,
            currentTime: currentTime,
            setCurrentTime: setCurrentTime,
            jumpToSecond,
            setVideoLengthSeconds,
        };
    }, [
        currentFeedIndex,
        currentUploadId,
        isMuted,
        isPlaying,
        jumpToSecond,
        mute,
        pause,
        play,
        currentTime,
        unmute,
        videoLengthSeconds,
    ]);

    return (
        <FeedContext.Provider value={value}>{children}</FeedContext.Provider>
    );
};
