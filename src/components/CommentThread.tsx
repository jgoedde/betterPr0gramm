import * as React from "react";
import { formatDistanceToNow } from "date-fns";

const Comment = ({
    content,
    name,
    created,
    children,
}: {
    content: string;
    name: string;
    up: number;
    created: number;
    down: number;
    children: React.ReactNode;
}) => {
    return (
        <div className="flex">
            <div className="flex-shrink-0 mr-3"></div>
            <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                <strong>{name}</strong>{" "}
                <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(Number(created + "000")), {
                        addSuffix: true,
                        includeSeconds: true,
                    })}
                </span>
                <p className="text-sm">{content}</p>
                <div className="space-y-4">{children}</div>
            </div>
        </div>
    );
};
export const CommentThread = ({
    comments,
    parentId = 0,
}: {
    comments: {
        id: number;
        parent: number;
        content: string;
        name: string;
        created: number;
        up: number;
        down: number;
    }[];
    parentId: number;
}) => {
    return comments
        .filter((comment) => comment.parent === parentId)
        .map((comment) => (
            <Comment
                key={comment.id}
                content={comment.content}
                name={comment.name}
                up={comment.up}
                down={comment.down}
                created={comment.created}
            >
                <CommentThread comments={comments} parentId={comment.id} />
            </Comment>
        ));
};
