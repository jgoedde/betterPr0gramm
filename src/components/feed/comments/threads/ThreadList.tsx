import { FC, useCallback, useMemo, useState } from "react";
import { Comment } from "@/components/feed/comments/Comment.ts";
import { ThreadItem } from "@/components/feed/comments/threads/ThreadItem.tsx";
import { Thread } from "@/components/feed/comments/threads/Thread.ts";
import { useComments } from "@/components/feed/comments/context/CommentsContext.ts";

type TBuildThreads = (comments: Comment[], parentId?: number) => Thread[];

export const ThreadList: FC = () => {
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
        <ThreadItem
            key={comment.id}
            comment={comment}
            replies={replies}
            depth={0}
            expandedReplies={expandedComments}
            setExpandedComments={setExpandedComments}
        />
    ));
};
