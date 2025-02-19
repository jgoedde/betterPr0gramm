import { useLocalStorage } from "@mantine/hooks";
import { useCallback } from "react";

type Seen = Record<number, Date>;

export function useSeen() {
    const [seen, setSeen] = useLocalStorage<Seen>({
        key: "betterPr0gramm-history",
        defaultValue: {},
        getInitialValueInEffect: false,
    });

    const markAsSeen = useCallback(
        (uploadId: number) => {
            setSeen((prev) => ({ ...prev, [uploadId]: new Date() }));
        },
        [setSeen]
    );

    return { seen, markAsSeen };
}
