import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useEffect } from "react";
import { isArray } from "lodash";

type ItemIdToVote = Record<number, "up" | "down" | "none">;

type Votes = {
    comments: ItemIdToVote;
    posts: ItemIdToVote;
    tags: ItemIdToVote;
    favs: number[];
};

export function useVote() {
    const [voting, setVoting] = useLocalStorage<Votes>({
        key: "betterPr0gramm-votes",
        defaultValue: {
            comments: {},
            posts: {},
            tags: {},
            favs: [],
        },
    });

    useEffect(
        function migrateToFavs() {
            if (isArray(voting.favs)) {
                return;
            }
            setVoting((prev) => ({ ...prev, favs: prev.favs ?? [] }));
        },
        [setVoting, voting.favs]
    );

    const isUp = useCallback(
        (type: keyof Votes, itemId: number) => {
            return voting[type]?.[itemId] === "up";
        },
        [voting]
    );

    const isDown = useCallback(
        (type: keyof Votes, itemId: number) => {
            return voting[type]?.[itemId] === "down";
        },
        [voting]
    );

    const revokeVote = useCallback(
        (type: keyof Votes, itemId: number) => {
            setVoting((prev) => ({
                ...prev,
                [type]: { ...prev[type], [itemId]: "none" },
            }));
        },
        [setVoting]
    );

    const upvote: (type: keyof Votes, itemId: number) => "up" | "none" =
        useCallback(
            (type, itemId) => {
                if (isUp(type, itemId)) {
                    revokeVote(type, itemId);
                    return "none";
                } else {
                    setVoting((prev) => ({
                        ...prev,
                        [type]: { ...prev[type], [itemId]: "up" },
                    }));
                    return "up";
                }
            },
            [isUp, revokeVote, setVoting]
        );

    const downvote: (type: keyof Votes, itemId: number) => "down" | "none" =
        useCallback(
            (type: keyof Votes, itemId: number) => {
                if (isDown(type, itemId)) {
                    revokeVote(type, itemId);
                    return "none";
                } else {
                    setVoting((prev) => ({
                        ...prev,
                        [type]: { ...prev[type], [itemId]: "down" },
                    }));
                    return "down";
                }
            },
            [isDown, revokeVote, setVoting]
        );

    const fav = useCallback(
        (uploadId: number) => {
            if (voting.favs.includes(uploadId)) {
                // Unfav:
                setVoting((prev) => ({
                    ...prev,
                    favs: [...prev.favs].filter((x) => x !== uploadId),
                }));
            } else {
                // Fav:
                setVoting((prev) => ({
                    ...prev,
                    favs: [...prev.favs, uploadId],
                }));
            }
        },
        [setVoting, voting.favs]
    );

    const isFav = useCallback(
        (uploadId: number) => {
            return voting.favs.includes(uploadId);
        },
        [voting.favs]
    );

    return {
        isUp,
        isDown,
        upvote,
        downvote,
        fav,
        isFav,
    };
}
