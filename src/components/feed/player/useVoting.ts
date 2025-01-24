import { useLocalStorage } from "@mantine/hooks";
import { useCallback } from "react";

type Voting = Record<number, "up" | "down" | "none">;

export function useVoting() {
    const [voting, setVoting] = useLocalStorage<Voting>({
        key: "pr0gramm-votes",
        defaultValue: {},
    });

    const isUp = useCallback(
        (uploadId: number) => {
            return voting[uploadId] === "up";
        },
        [voting]
    );

    const isDown = useCallback(
        (uploadId: number) => {
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
