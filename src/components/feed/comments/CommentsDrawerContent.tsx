import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { buildCookiesHeader, useAuth } from "@/hooks/use-auth.ts";
import { CommentSection } from "@/components/feed/comments/CommentSection.tsx";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea.tsx";
import { isEmpty } from "lodash";
import { cn } from "@/lib/utils.ts";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import { useComments } from "@/contexts/comments/CommentsContext.ts";

const DEFAULT_NEW_COMMENT_PLACEHOLDER = "Kommentar hinzufügen ...";
const REPLY_TO_COMMENT_PLACEHOLDER = "Antwort auf {0}";

type Props = {
    revalidate: VoidFunction;
    uploadId: number;
};

export const CommentsDrawerContent: FC<Props> = ({ revalidate, uploadId }) => {
    const { cookies } = useAuth();
    const { comment, setComment, highlightedCommentId, comments } =
        useComments();
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (!textAreaRef.current) {
            return;
        }

        textAreaRef.current.style.height = "0px";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }, [textAreaRef]);

    useEffect(() => {
        if (!textAreaRef.current) {
            return;
        }

        if (highlightedCommentId) {
            textAreaRef.current.focus();
        }
    }, [highlightedCommentId, textAreaRef]);

    const isDisabled = useMemo(() => {
        return isEmpty(comment) || !cookies;
    }, [comment, cookies]);

    const onSendClick = useCallback(async () => {
        await fetch(`${BASE_URL}/api/comments/post`, {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                ...buildCookiesHeader(cookies),
            },
            body: new URLSearchParams({
                itemId: String(uploadId),
                parent: String(highlightedCommentId ?? 0),
                comment,
            }).toString(),
        });
        revalidate();
    }, [comment, cookies, highlightedCommentId, revalidate, uploadId]);

    const placeholderText = useMemo(() => {
        const recipientName = comments.find(
            (c) => c.id === highlightedCommentId
        )?.name;

        if (recipientName != null) {
            return REPLY_TO_COMMENT_PLACEHOLDER.replace("{0}", recipientName);
        }

        return DEFAULT_NEW_COMMENT_PLACEHOLDER;
    }, [comments, highlightedCommentId]);

    return (
        <div className={"flex flex-col justify-between h-[calc(100%-60px)]"}>
            <div className={"p-4 overflow-x-scroll overflow-y-scroll"}>
                <CommentSection />
            </div>
            <div className={"w-full p-3 max-h-36 flex flex-col-reverse"}>
                {!isEmpty(comment) && (
                    <div
                        className={cn(
                            "text-white self-end pt-3",
                            isDisabled && "text-opacity-30"
                        )}
                    >
                        <Send onClick={onSendClick} size={22} />
                    </div>
                )}
                <Textarea
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                    }}
                    ref={(ref) => {
                        textAreaRef.current = ref;

                        // There must be a cleaner way...
                        if (ref) {
                            ref.style.height = "0px";
                            ref.style.height = `${ref.scrollHeight}px`;
                        }
                    }}
                    placeholder={placeholderText}
                />
            </div>
        </div>
    );
};
