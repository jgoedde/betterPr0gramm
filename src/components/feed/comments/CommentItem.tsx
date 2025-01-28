import { FC, useCallback, useMemo } from "react";
import { Comment } from "@/components/feed/comments/Comment.ts";
import { Thread } from "@/components/feed/comments/Thread.ts";
import { cn } from "@/lib/utils.ts";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Panel } from "@/components/feed/comments/Expandable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Heart, ThumbsDown } from "lucide-react";
import { useComments } from "@/contexts/comments/CommentsContext.ts";

type Props = {
    comment: Comment;
    replies: Thread[];
    level: number;
    expandedComments: number[];
    setExpandedComments: (
        value: ((prevState: number[]) => number[]) | number[]
    ) => void;
};

export const CommentItem: FC<Props> = ({
    comment,
    replies,
    level,
    expandedComments,
    setExpandedComments,
}) => {
    const { setHighlightedCommentId, highlightedCommentId } = useComments();
    const hasParent = comment.parent != 0;

    const isExpanded = useMemo(() => {
        return expandedComments.includes(comment.id) || level >= 1;
    }, [comment.id, expandedComments, level]);

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

    return (
        <div className={cn("pl-4", hasParent ? "border-l mt-4" : "mt-8")}>
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
                <div className="mb-2">{comment.content}</div>
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
                        <div className={"flex items-center space-x-1"}>
                            <Heart size={18} />
                            <span>{comment.up - comment.down}</span>
                        </div>
                        <div>
                            <ThumbsDown size={18} />
                        </div>
                    </div>
                </div>
            </div>
            {replies.length > 0 && (
                <>
                    {!isExpanded && level === 0 && (
                        <Panel onClick={expand} text={"Mehr anzeigen"} />
                    )}
                    {isExpanded && (
                        <div className="mt-4">
                            {replies.map((reply) => (
                                <CommentItem
                                    key={reply.comment.id}
                                    comment={reply.comment}
                                    replies={reply.replies}
                                    level={level + 1}
                                    expandedComments={expandedComments}
                                    setExpandedComments={setExpandedComments}
                                />
                            ))}
                            {level === 0 && (
                                <Panel onClick={collapse} text={"Verbergen"} />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
