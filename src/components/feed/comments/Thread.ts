import { Comment } from "@/components/feed/comments/Comment.ts";

export type Thread = {
    comment: Comment;
    replies: Thread[];
};