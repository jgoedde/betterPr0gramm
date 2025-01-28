import { FC, ReactNode, useMemo, useState } from "react";
import { Comment } from "@/components/feed/comments/Comment.ts";
import { CommentsContext } from "./CommentsContext.ts";

export const CommentsContextProvider: FC<{
    children: ReactNode;
    comments: Comment[];
}> = ({ children, comments }) => {
    const [highlightedCommentId, setHighlightedCommentId] = useState<number>();
    const [comment, setComment] = useState<string>("");

    const value = useMemo(() => {
        return {
            comment,
            setComment,
            highlightedCommentId,
            setHighlightedCommentId,
            comments,
        };
    }, [comment, comments, highlightedCommentId]);

    return (
        <CommentsContext.Provider value={value}>
            {children}
        </CommentsContext.Provider>
    );
};
