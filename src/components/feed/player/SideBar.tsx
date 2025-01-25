import { MessageSquareMore, MinusCircle, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { FC, useState } from "react";
import { useVoting } from "@/components/feed/player/useVoting.ts";
import { cn } from "@/lib/utils";

type Props = {
    uploadId: number;
    benis: number;
    loading: boolean;
    commentResponses: never[];
};

export const SideBar: FC<Props> = ({
    uploadId,
    benis,
    commentResponses,
    loading,
}) => {
    const [benisTmp, setBenisTmp] = useState<number>(benis);
    const { isUp, downvote, upvote, revokeVote, isDown } = useVoting();

    return (
        <div className="absolute bottom-0 right-0 flex flex-col gap-1 z-10 p-2 text-white">
            <div className={"my-4"}>
                <div
                    className={"flex flex-col items-center justify-center"}
                    onClick={() => {
                        // TODO: make fetch

                        if (isUp(uploadId)) {
                            revokeVote(uploadId);
                            setBenisTmp((prev) => prev - 1);
                        } else {
                            upvote(uploadId);
                            setBenisTmp((prev) => prev + 1);
                        }
                    }}
                >
                    <PlusCircle
                        className={cn(isUp(uploadId) && "text-red-600")}
                        size={33}
                    />
                    {benisTmp >= 1 && <span>{benisTmp}</span>}
                </div>
                <div
                    className={"flex flex-col items-center justify-center"}
                    onClick={() => {
                        // TODO: make fetch

                        if (isDown(uploadId)) {
                            revokeVote(uploadId);
                            setBenisTmp((prev) => prev + 1);
                        } else {
                            downvote(uploadId);
                            setBenisTmp((prev) => prev - 1);
                        }
                    }}
                >
                    <MinusCircle
                        className={cn(isDown(uploadId) && "text-gray-600")}
                        size={33}
                    />
                    {benisTmp <= 0 && <span>{benisTmp}</span>}
                </div>
            </div>
            <div className={"flex flex-col items-center justify-center"}>
                <MessageSquareMore size={33} />

                {loading ? (
                    <Skeleton className={"h-2 w-4"} />
                ) : (
                    <span>{commentResponses.length}</span>
                )}
            </div>
        </div>
    );
};
