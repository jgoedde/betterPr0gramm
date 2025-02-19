import { createContext, useContext } from "react";

export interface IFeedContext {
    currentUploadId?: number;
    currentFeedIndex: number;
    setCurrentFeedIndex: (index: number) => void;
    setCurrentUploadId: (id: number) => void;
    isMuted: boolean;
    isPlaying: boolean;
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
