import {
    MessageSquareMore,
    MinusCircle,
    PlusCircle,
    Volume,
    VolumeOff,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { FC, useCallback, useMemo, useState } from "react";
import { useVote } from "@/components/feed/player/use-vote.ts";
import { cn } from "@/lib/utils.ts";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import { buildCookiesHeader, useAuth } from "@/hooks/use-auth.ts";
import { DrawerTrigger } from "@/components/ui/drawer.tsx";
import { Comment } from "@/components/feed/comments/Comment.ts";
import { usePlaybackContext } from "@/hooks/use-playback-context.ts";
import { Upload } from "@/components/feed/Upload.ts";

type Props = {
    uploadId: number;
    benis: number;
    isLoading: boolean;
    comments: Comment[];
    uploadType: Upload["type"];
};

export const SideBar: FC<Props> = ({
    uploadId,
    benis,
    comments,
    isLoading,
    uploadType,
}) => {
    const [benisTmp, setBenisTmp] = useState<number>(benis);
    const { isUp, downvote, upvote, revokeVote, isDown } = useVote();
    const { cookies } = useAuth();
    const { shouldPlayAudio, setShouldPlayAudio } = usePlaybackContext();

    const nonce = useMemo(() => {
        if (cookies == null) {
            return undefined;
        }
        return cookies.me.id.slice(0, 16);
    }, [cookies]);

    const postVote = useCallback(
        (vote: 1 | 0 | -1) => {
            void fetch(`${BASE_URL}/api/items/vote`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    ...buildCookiesHeader(cookies),
                },
                body: JSON.stringify({
                    id: uploadId,
                    vote,
                    _nonce: nonce,
                }),
            });
        },
        [cookies, nonce, uploadId]
    );

    const onUpvoteClick = useCallback(() => {
        let vote: 0 | 1;

        if (isUp(uploadId)) {
            revokeVote(uploadId);
            setBenisTmp((prev) => prev - 1);
            vote = 0;
        } else {
            upvote(uploadId);
            setBenisTmp((prev) => prev + 1);
            vote = 1;
        }

        if (cookies) {
            postVote(vote);
        }
    }, [cookies, isUp, postVote, revokeVote, uploadId, upvote]);

    const onDownvoteClick = useCallback(() => {
        let vote: 0 | -1;

        if (isDown(uploadId)) {
            revokeVote(uploadId);
            setBenisTmp((prev) => prev + 1);
            vote = 0;
        } else {
            downvote(uploadId);
            setBenisTmp((prev) => prev - 1);
            vote = -1;
        }

        if (cookies) {
            postVote(vote);
        }
    }, [cookies, downvote, isDown, postVote, revokeVote, uploadId]);

    return (
        <div className="absolute bottom-0 right-0 flex flex-col gap-1 z-10 p-2 text-white">
            <div className={"my-4"}>
                <div
                    className={"flex flex-col items-center justify-center"}
                    onClick={onUpvoteClick}
                >
                    <PlusCircle
                        className={cn(isUp(uploadId) && "text-red-600")}
                        size={33}
                    />
                    {benisTmp >= 1 && <span>{benisTmp}</span>}
                </div>
                <div
                    className={"flex flex-col items-center justify-center"}
                    onClick={onDownvoteClick}
                >
                    <MinusCircle
                        className={cn(isDown(uploadId) && "text-gray-600")}
                        size={33}
                    />
                    {benisTmp <= 0 && <span>{benisTmp}</span>}
                </div>
            </div>
            <div className={"flex flex-col items-center justify-center"}>
                <DrawerTrigger>
                    <MessageSquareMore size={33} />

                    {isLoading ? (
                        <Skeleton className={"h-2 w-4"} />
                    ) : (
                        <span>{comments.length}</span>
                    )}
                </DrawerTrigger>
            </div>

            {uploadType === "video" && (
                <div className={"flex flex-col items-center justify-center"}>
                    {shouldPlayAudio ? (
                        <Volume
                            size={33}
                            onClick={() => setShouldPlayAudio(false)}
                        />
                    ) : (
                        <VolumeOff
                            onClick={() => setShouldPlayAudio(true)}
                            size={33}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
