import { FC, useCallback, useMemo, useState } from "react";
import { Comment } from "@/components/feed/comments/Comment.ts";
import { CommentItem } from "@/components/feed/comments/CommentItem.tsx";
import { Thread } from "@/components/feed/comments/Thread.ts";
import { useComments } from "@/contexts/comments/CommentsContext.ts";

type TBuildThreads = (comments: Comment[], parentId?: number) => Thread[];

export const CommentSection: FC = () => {
    const { comments } = useComments();
    const [expandedComments, setExpandedComments] = useState<number[]>([]);

    const buildThreads: TBuildThreads = useCallback(
        (comments, parentId = 0) => {
            return comments
                .filter((comment) => comment.parent === parentId)
                .map((comment) => ({
                    comment,
                    replies: buildThreads(comments, comment.id),
                }));
        },
        []
    );

    const threads = useMemo(
        () => buildThreads(comments),
        [buildThreads, comments]
    );

    return threads.map(({ comment, replies }) => (
        <CommentItem
            key={comment.id}
            comment={comment}
            replies={replies}
            level={0}
            expandedComments={expandedComments}
            setExpandedComments={setExpandedComments}
        />
    ));
};
