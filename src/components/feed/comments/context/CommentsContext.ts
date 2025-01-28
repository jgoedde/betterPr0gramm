import { Comment } from "@/components/feed/comments/Comment.ts";
import { createContext, useContext } from "react";

export type CommentsContext = {
    comments: Comment[];
    highlightedCommentId?: number;
    setHighlightedCommentId: (commentId?: number) => void;
    comment: string;
    setComment: (comment: string) => void;
};

export const CommentsContext = createContext<CommentsContext | null>(null);

export function useComments() {
    const context = useContext(CommentsContext);

    if (context == null) {
        throw new Error("useComments must be consumed within CommentsContext.");
    }

    return context;
}
