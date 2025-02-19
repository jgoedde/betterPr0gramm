import { useCallback } from "react";
import { useLocalStorage } from "@mantine/hooks";

enum ContentMask {
    SFW = 1 << 0,
    NSFW = 1 << 1,
    NSFL = 1 << 2,
    NSFP = 1 << 3,
    POL = 3 << 4,
}

export type FeedPreferences = {
    contentType: number;
};

const DEFAULT: FeedPreferences = {
    contentType: ContentMask.SFW,
};

export function usePreferences() {
    const [preferences, setPreferences] = useLocalStorage<FeedPreferences>({
        key: "betterPr0gramm-feed",
        defaultValue: DEFAULT,
        getInitialValueInEffect: false,
    });

    const setContentType = useCallback(
        (contentType: number) => {
            setPreferences((prevState) => ({
                ...prevState,
                contentType,
            }));
        },
        [setPreferences]
    );

    return {
        preferences: preferences, // Should not be undefined?
        setContentType,
    };
}
