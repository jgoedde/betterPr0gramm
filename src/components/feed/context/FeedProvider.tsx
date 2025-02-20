import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import {
    FeedContext,
    IFeedContext,
} from "@/components/feed/context/FeedContext.ts";
import { emitter } from "@/emitter.ts";
import { FeedItem } from "@/components/feed/FeedItem.ts";

export const FeedProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [currentFeedIndex, setCurrentFeedIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [currentUpload, setCurrentUpload] = useState<FeedItem>();
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
            currentUpload,
            isPlaying,
            setCurrentFeedIndex,
            setCurrentUpload,
            videoLengthSeconds,
            currentTime: currentTime,
            setCurrentTime: setCurrentTime,
            jumpToSecond,
            setVideoLengthSeconds,
        };
    }, [
        currentFeedIndex,
        currentUpload,
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
