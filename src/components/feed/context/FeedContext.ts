import { createContext, useContext } from "react";
import { FeedItem } from "@/components/feed/FeedItem.ts";

export interface IFeedContext {
    currentUpload?: FeedItem;
    currentFeedIndex: number;
    setCurrentFeedIndex: (index: number) => void;
    setCurrentUpload: (upload: FeedItem) => void;
    isMuted: boolean;
    isPlaying: boolean;
    jumpToSecond: (sec: number) => void;
    currentTime?: number;
    setCurrentTime: (sec: number) => void;
    videoLengthSeconds?: number;
    setVideoLengthSeconds: (val: number) => void;
    mute: VoidFunction;
    unmute: VoidFunction;
    pause: VoidFunction;
    play: VoidFunction;
}

export const FeedContext = createContext<IFeedContext | null>(null);

export function useFeedContext(): IFeedContext {
    const ctx = useContext(FeedContext);

    if (ctx == null) {
        throw new Error("useFeedContext must be used within context");
    }

    return ctx;
}
