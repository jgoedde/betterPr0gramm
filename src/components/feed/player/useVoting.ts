import { useCallback } from "react";
import { useLocalStorage } from "react-use";

type Voting = Record<number, "up" | "down" | "none">;

export function useVoting() {
    const [voting, setVoting] = useLocalStorage<Voting>(
        "betterPr0gramm-votes",
        {}
    );

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
