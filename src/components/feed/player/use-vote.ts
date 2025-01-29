import { useLocalStorage } from "@mantine/hooks";
import { useCallback } from "react";

type ItemIdToVote = Record<number, "up" | "down" | "none">;

type Votes = {
    comments: ItemIdToVote;
    posts: ItemIdToVote;
    tags: ItemIdToVote;
};

export function useVote() {
    const [voting, setVoting] = useLocalStorage<Votes>({
        key: "betterPr0gramm-votes",
        defaultValue: {
            comments: {},
            posts: {},
            tags: {},
        },
    });

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

    return {
        isUp,
        isDown,
        upvote,
        downvote,
    };
}
