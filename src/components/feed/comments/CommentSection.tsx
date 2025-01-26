import { FC } from "react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Comment } from "@/components/feed/comments/Comment.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { cn } from "@/lib/utils.ts";

type CommentSectionProps = {
    comments: Comment[];
};

const CommentItem: FC<{ comment: Comment; childComments: Comment[] }> = ({
    comment,
    childComments,
}) => {
    const hasParent = comment.parent != 0;
    return (
        <div className={cn("pl-4", hasParent ? "border-l mt-4" : "mt-8")}>
            <div className="mb-2">
                <span className="font-bold">{comment.name}</span>
                <span className="text-muted-foreground text-sm ml-2">
                    {formatDistanceToNow(comment.created, {
                        addSuffix: true,
                        locale: de,
                        includeSeconds: true,
                    })}
                </span>
            </div>
            <div className="mb-2">{comment.content}</div>
            <div className="text-sm text-muted-foreground flex h-5 space-x-2">
                <div>Up: {comment.up}</div>
                <Separator orientation={"vertical"} />
                <div>Down: {comment.down}</div>
            </div>
            {childComments.length > 0 && (
                <div className="mt-4">
                    {childComments.map((child) => (
                        <CommentItem
                            key={child.id}
                            comment={child}
                            childComments={childComments.filter(
                                (c) => c.parent === child.id
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const CommentSection: FC<CommentSectionProps> = ({ comments }) => {
    const rootComments = comments.filter((comment) => comment.parent === 0);

    return (
        <div className="p-4">
            {rootComments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    childComments={comments.filter(
                        (c) => c.parent === comment.id
                    )}
                />
            ))}
        </div>
    );
};
