import { useCallback, useEffect, useMemo, useState } from "react";
import { differenceBy, uniqBy } from "lodash";
import { useSeen } from "@/components/feed/use-seen.ts";
import { ItemResponse, useTopPosts } from "@/components/feed/use-top-posts.ts";
import { buildFeedItem, FeedItem } from "@/components/feed/FeedItem.ts";

export const TAKE_POSTS = 3;

export function useDoomscroll(currentIndex: number) {
    const [uploads, setUploads] = useState<ItemResponse[]>([]);
    const [feed, setFeed] = useState<FeedItem[]>([]);

    const { seen, markAsSeen } = useSeen();

    const { topPosts, revalidate, isLoading } = useTopPosts();

    useEffect(() => {
        if (uploads.length > 0 && uploads.every((u) => seen[u.id] != null)) {
            revalidate();
        }
    }, [revalidate, seen, uploads]);

    useEffect(() => {
        if (!topPosts?.items) {
            return;
        }

        setUploads((prevItems) => {
            const uniqueUploads = differenceBy(topPosts.items, prevItems, "id");

            if (uniqueUploads.length === 0) {
                return prevItems;
            }

            const after = prevItems.slice(currentIndex + 1);
            const before = prevItems.slice(0, currentIndex + 1);

            console.group(`new uploads ${new Date().toISOString()}`);
            console.info("Found new uploads");
            console.log(
                before.map((b) => ({ id: b.id, user: b.user })),
                "before"
            );
            console.log(
                uniqueUploads.map((b) => ({ id: b.id, user: b.user })),
                "uniqueUploads"
            );
            console.log(
                after.map((b) => ({ id: b.id, user: b.user })),
                "after"
            );
            console.log(currentIndex, "currentIndex");
            console.groupEnd();

            const uniqueOrdered = [
                ...uniqueUploads.filter((upload) => seen[upload.id] == null),
                ...uniqueUploads.filter((upload) => seen[upload.id] != null),
            ];

            const afterOrdered = [
                ...after.filter((upload) => seen[upload.id] == null),
                ...after.filter((upload) => seen[upload.id] != null),
            ];

            return [...before, ...uniqueOrdered, ...afterOrdered];
        });
    }, [currentIndex, seen, topPosts?.items]);

    //region seed
    useEffect(() => {
        if (feed.length === 0 && uploads.length > 0) {
            setFeed(uploads.slice(0, TAKE_POSTS).map(buildFeedItem));
        }
    }, [feed.length, uploads]);
    //endregion

    const next = useMemo(() => {
        return uploads
            .slice(currentIndex, currentIndex + TAKE_POSTS + 1)
            .map(buildFeedItem);
    }, [currentIndex, uploads]);

    const loadMore = useCallback(() => {
        setFeed((prev) =>
            uniqBy(
                [
                    ...prev, // ## This prevents layout shifts ##
                    ...next,
                ],
                "id"
            )
        );
    }, [next]);

    useEffect(() => {
        if (feed[currentIndex]) {
            markAsSeen(feed[currentIndex].id);
        }
    }, [currentIndex, feed, markAsSeen]);

    useEffect(() => {
        console.group("feed change " + new Date().toISOString());
        console.log(feed, "feed");
        console.groupEnd();
    }, [feed]);

    return { feed, loadMore, isLoading };
}
