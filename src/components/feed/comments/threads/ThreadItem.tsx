import { FC, useCallback, useMemo } from "react";
import { Comment } from "@/components/feed/comments/Comment.ts";
import { Thread } from "@/components/feed/comments/threads/Thread.ts";
import { cn } from "@/lib/utils.ts";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Panel } from "@/components/feed/comments/threads/Expandable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Heart, ThumbsDown } from "lucide-react";
import { useComments } from "@/components/feed/comments/context/CommentsContext.ts";
import { useVote } from "@/components/feed/player/use-vote.ts";
import { buildCookiesHeader, useAuth } from "@/hooks/use-auth.ts";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import { Linkify } from "@/components/Linkify.tsx";

type Props = {
    comment: Comment;
    replies: Thread[];
    depth: number;

    /**
     * A list of comment IDs that are expanded in the UI.
     */
    expandedReplies: number[];

    setExpandedComments: (
        value: ((prevState: number[]) => number[]) | number[]
    ) => void;
};

export const ThreadItem: FC<Props> = ({
    comment,
    replies,
    depth,
    expandedReplies,
    setExpandedComments,
}) => {
    const { isAuthenticated, cookies, extractNonce } = useAuth();
    const { setHighlightedCommentId, highlightedCommentId } = useComments();
    const {
        isUp: isItemUpvoted,
        isDown: isItemDownvoted,
        upvote,
        downvote,
    } = useVote();

    const isExpanded = useMemo(() => {
        return expandedReplies.includes(comment.id) || depth >= 1;
    }, [comment.id, expandedReplies, depth]);

    const expand = useCallback(() => {
        setExpandedComments((prev) => [...prev, comment.id]);
    }, [comment.id, setExpandedComments]);

    const collapse = useCallback(() => {
        setExpandedComments((prev) => prev.filter((p) => p !== comment.id));
    }, [comment.id, setExpandedComments]);

    const onAnswerButtonClick = useCallback(() => {
        if (highlightedCommentId === comment.id) {
            setHighlightedCommentId(undefined);
        } else {
            setHighlightedCommentId(comment.id);
        }
    }, [comment.id, highlightedCommentId, setHighlightedCommentId]);

    const isUp = useMemo(() => {
        return isItemUpvoted("comments", comment.id);
    }, [comment.id, isItemUpvoted]);

    const isDown = useMemo(() => {
        return isItemDownvoted("comments", comment.id);
    }, [comment.id, isItemDownvoted]);

    const heartsCount = useMemo(() => {
        const score = comment.up - comment.down;

        if (isUp) {
            return score + 1;
        }
        if (isDown) {
            return score - 1;
        }

        return score;
    }, [comment.down, comment.up, isDown, isUp]);

    const postVote = useCallback(
        async (vote: -1 | 0 | 1) => {
            if (!isAuthenticated) {
                return;
            }

            const nonce = extractNonce();

            await fetch(`${BASE_URL}/api/comments/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    ...buildCookiesHeader(cookies),
                },
                body: new URLSearchParams({
                    id: String(comment.id),
                    vote: String(vote),
                    _nonce: String(nonce),
                }).toString(),
            });
        },
        [comment.id, cookies, extractNonce, isAuthenticated]
    );

    const onHeartClick = useCallback(() => {
        const vote = upvote("comments", comment.id) === "up" ? 1 : 0;

        if (isAuthenticated) {
            void postVote(vote);
        }
    }, [upvote, comment.id, isAuthenticated, postVote]);

    const onThumbsDownClick = useCallback(() => {
        const vote = downvote("comments", comment.id) === "down" ? -1 : 0;

        if (isAuthenticated) {
            void postVote(vote);
        }
    }, [downvote, comment.id, isAuthenticated, postVote]);

    return (
        <div
            className={cn(
                "pl-4",
                comment.parent != 0 ? "border-l mt-4" : "mt-8"
            )}
        >
            <div
                className={cn(
                    "transition-opacity duration-150 ease-in-out",
                    highlightedCommentId != null &&
                        highlightedCommentId != comment.id &&
                        "opacity-15"
                )}
            >
                <div className="mb-2">
                    <span className="text-muted-foreground">
                        {comment.name}
                    </span>
                    <span className="text-muted-foreground text-sm ml-2">
                        {formatDistanceToNow(comment.created, {
                            addSuffix: true,
                            locale: de,
                            includeSeconds: true,
                        })}
                    </span>
                </div>
                <div className="mb-2">
                    <Linkify text={comment.content} />
                </div>
                <div className="flex h-full space-x-2 w-full justify-between items-center">
                    <Button
                        variant={"link"}
                        className={"text-muted-foreground"}
                        onClick={onAnswerButtonClick}
                    >
                        {highlightedCommentId === comment.id
                            ? "Abbrechen"
                            : "Antworten"}
                    </Button>
                    <div className={"flex space-x-4 items-center"}>
                        <div
                            className={cn(
                                "flex items-center space-x-1",
                                isUp && "text-red-600"
                            )}
                            onClick={onHeartClick}
                        >
                            <Heart size={18} />
                            <span>{heartsCount}</span>
                        </div>
                        <div>
                            <ThumbsDown
                                className={cn(isDown && "text-gray-800")}
                                size={18}
                                onClick={onThumbsDownClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {replies.length > 0 && (
                <>
                    {!isExpanded && depth === 0 && (
                        <Panel onClick={expand} text={"Mehr anzeigen"} />
                    )}
                    {isExpanded && (
                        <div className="mt-4">
                            {replies.map((reply) => (
                                <ThreadItem
                                    key={reply.comment.id}
                                    comment={reply.comment}
                                    replies={reply.replies}
                                    depth={depth + 1}
                                    expandedReplies={expandedReplies}
                                    setExpandedComments={setExpandedComments}
                                />
                            ))}
                            {depth === 0 && (
                                <Panel onClick={collapse} text={"Verbergen"} />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
