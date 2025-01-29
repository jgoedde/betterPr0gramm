import { useLocalStorage } from "@mantine/hooks";
import { useCallback } from "react";

type VoteMap = Record<number, "up" | "down" | "none">;

export function useVote() {
    const [voting, setVoting] = useLocalStorage<VoteMap>({
        key: "betterPr0gramm-votes",
        defaultValue: {},
    });

    const isUp = useCallback(
        (uploadId: number) => {
            if (!voting) {
                throw new Error("Error reading voting data");
            }
            return voting[uploadId] === "up";
        },
        [voting]
    );

    const isDown = useCallback(
        (uploadId: number) => {
            if (!voting) {
                throw new Error("Error reading voting data");
            }
            return voting[uploadId] === "down";
        },
        [voting]
    );

    const upvote = useCallback(
        (uploadId: number) => {
            setVoting((prev) => ({ ...prev, [uploadId]: "up" }));
        },
        [setVoting]
    );

    const downvote = useCallback(
        (uploadId: number) => {
            setVoting((prev) => ({ ...prev, [uploadId]: "down" }));
        },
        [setVoting]
    );

    const revokeVote = useCallback(
        (uploadId: number) => {
            setVoting((prev) => ({ ...prev, [uploadId]: "none" }));
        },
        [setVoting]
    );

    return { isUp, isDown, upvote, downvote, revokeVote };
}
