import {
    MessageSquareMore,
    MinusCircle,
    PlusCircle,
    Volume,
    VolumeOff,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { FC, useCallback, useMemo } from "react";
import { useVote } from "@/components/feed/player/use-vote.ts";
import { cn } from "@/lib/utils.ts";
import { buildCookiesHeader, useAuth } from "@/hooks/use-auth.ts";
import { DrawerTrigger } from "@/components/ui/drawer.tsx";
import { Comment } from "@/components/feed/comments/Comment.ts";
import { usePlaybackContext } from "@/hooks/use-playback-context.ts";
import { Upload } from "@/components/feed/Upload.ts";
import { BASE_URL } from "@/api/pr0grammApi.ts";

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
    const { isUp, downvote, upvote, isDown } = useVote();
    const { cookies, extractNonce, isAuthenticated } = useAuth();
    const { shouldPlayAudio, setShouldPlayAudio } = usePlaybackContext();

    const postVote = useCallback(
        (vote: 1 | 0 | -1) => {
            if (!isAuthenticated) {
                return;
            }

            const nonce = extractNonce();

            void fetch(`${BASE_URL}/api/items/vote`, {
                method: "POST",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    ...buildCookiesHeader(cookies),
                },
                body: new URLSearchParams({
                    id: String(uploadId),
                    vote: String(vote),
                    _nonce: nonce,
                }).toString(),
            });

            // console.info("Should perform fetch now, but is stubbed...");
            // console.log(
            //     vote,
            //     cookies,
            //     nonce,
            //     uploadId,
            //     "vote,cookies,nonce,uploadId"
            // );
        },
        [cookies, extractNonce, isAuthenticated, uploadId]
    );

    const benisTmp = useMemo(() => {
        const score = benis;

        if (isUp("posts", uploadId)) {
            return score + 1;
        }
        if (isDown("posts", uploadId)) {
            return score - 1;
        }

        return score;
    }, [benis, isDown, isUp, uploadId]);

    const onUpvoteClick = useCallback(() => {
        const vote = upvote("posts", uploadId) === "up" ? 1 : 0;

        if (cookies) {
            postVote(vote);
        }
    }, [cookies, postVote, uploadId, upvote]);

    const onDownvoteClick = useCallback(() => {
        const vote = downvote("posts", uploadId) === "down" ? -1 : 0;

        if (cookies) {
            postVote(vote);
        }
    }, [cookies, downvote, postVote, uploadId]);

    return (
        <div className="absolute bottom-0 right-0 flex flex-col gap-1 z-10 p-2 text-white">
            <div className={"my-4"}>
                <div
                    className={"flex flex-col items-center justify-center"}
                    onClick={onUpvoteClick}
                >
                    <PlusCircle
                        className={cn(
                            isUp("posts", uploadId) && "text-red-600"
                        )}
                        size={33}
                    />
                    {benisTmp >= 1 && <span>{benisTmp}</span>}
                </div>
                <div
                    className={"flex flex-col items-center justify-center"}
                    onClick={onDownvoteClick}
                >
                    <MinusCircle
                        className={cn(
                            isDown("posts", uploadId) && "text-gray-600"
                        )}
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
