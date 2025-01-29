import { FC, useCallback, useMemo } from "react";
import { Tag } from "@/components/feed/player/Tag.ts";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { badgeVariants } from "@/components/ui/badge.tsx";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useVote } from "@/components/feed/player/use-vote.ts";
import { cn } from "@/lib/utils.ts";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import { buildCookiesHeader, useAuth } from "@/hooks/use-auth.ts";

type Props = { tag: Tag };

export const TagPopover: FC<Props> = ({ tag }) => {
    const { isUp, isDown, upvote, downvote } = useVote();
    const { isAuthenticated, extractNonce, cookies } = useAuth();

    const isUpvoted = useMemo(() => {
        return isUp("tags", tag.id);
    }, [isUp, tag.id]);

    const isDownvoted = useMemo(() => {
        return isDown("tags", tag.id);
    }, [isDown, tag.id]);

    const postVote = useCallback(
        (vote: -1 | 0 | 1) => {
            if (!isAuthenticated) {
                return;
            }
            void fetch(`${BASE_URL}/api/tags/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    ...buildCookiesHeader(cookies),
                },
                body: new URLSearchParams({
                    id: String(tag.id),
                    vote: String(vote),
                    _nonce: extractNonce(),
                }).toString(),
            });
        },
        [cookies, extractNonce, isAuthenticated, tag.id]
    );

    const onPlusIconClick = useCallback(() => {
        const vote = upvote("tags", tag.id) === "up" ? 1 : 0;

        postVote(vote);
    }, [postVote, tag.id, upvote]);

    const onMinusIconClick = useCallback(() => {
        const vote = downvote("tags", tag.id) === "down" ? -1 : 0;

        postVote(vote);
    }, [downvote, postVote, tag.id]);

    return (
        <Popover key={`popover-tag-${tag.id}`}>
            <PopoverTrigger asChild>
                <div
                    className={badgeVariants({
                        variant: "default",
                        className:
                            "border-orange-600 bg-secondary text-white hover:bg-orange-600",
                    })}
                >
                    {tag.name}
                </div>
            </PopoverTrigger>
            <PopoverContent side={"top"} className={"w-20 relative"}>
                <PlusIcon
                    onClick={onPlusIconClick}
                    className={cn(
                        "absolute left-0 -translate-y-1/2 translate-x-1/2",
                        isUpvoted && "text-orange-600"
                    )}
                />
                <MinusIcon
                    onClick={onMinusIconClick}
                    className={cn(
                        "absolute right-0 -translate-y-1/2 -translate-x-1/2",
                        isDownvoted && "text-gray-700"
                    )}
                />
            </PopoverContent>
        </Popover>
    );
};
