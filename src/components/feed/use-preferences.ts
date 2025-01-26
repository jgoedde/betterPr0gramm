import { useLocalStorage } from "react-use";
import { useCallback } from "react";

enum ContentMask {
    SFW = 1 << 0,
    NSFW = 1 << 1,
    NSFL = 1 << 2,
    NSFP = 1 << 3,
    POL = 3 << 4,
}

export type FeedPreferences = {
    contentType: number;
    feed: "beliebt" | "neu";
};

const DEFAULT: FeedPreferences = {
    contentType: ContentMask.SFW,
    feed: "beliebt",
};

export function usePreferences() {
    const [preferences, setPreferences] = useLocalStorage<FeedPreferences>(
        "betterPr0gramm-feed"
    );

    const setContentType = useCallback(
        (contentType: number) => {
            setPreferences((prevState) => ({
                ...(prevState ?? DEFAULT),
                contentType,
            }));
        },
        [setPreferences]
    );

    const setFeed = useCallback(
        (feed: FeedPreferences["feed"]) => {
            setPreferences((prevState) => ({
                ...(prevState ?? DEFAULT),
                feed,
            }));
        },
        [setPreferences]
    );

    return {
        preferences: preferences ?? DEFAULT, // Should not be undefined?
        setContentType,
        setFeed,
    };
}
