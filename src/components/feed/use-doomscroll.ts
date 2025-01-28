import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { Fetcher } from "swr";
import { buildCookiesHeader, Cookies, useAuth } from "@/hooks/use-auth.ts";
import { FeedPreferences } from "@/components/feed/use-preferences.ts";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import { uniqBy } from "lodash";

type ItemResponse = {
    height: number;
    width: number;
    id: number;
    up: number;
    down: number;
    created: number;
    image: string;
    user: string;
};

type GetPostsResponse = {
    items: ItemResponse[];
};

const TAKE_POSTS = 3;

type CacheKey = {
    contentType: number;
    feed: "beliebt" | "neu";
    baseUrl: string;
    cookies: Cookies | undefined;
};

const fetcher: Fetcher<GetPostsResponse, CacheKey> = async ({
    contentType,
    baseUrl,
    cookies,
    feed,
}) => {
    const urlSearchParams = new URLSearchParams({
        flags: String(contentType),
        ...(feed === "beliebt" && { promoted: "1" }),
        showJunk: String(false),
    });

    const response = await fetch(`${baseUrl}?${urlSearchParams.toString()}`, {
        method: "GET",
        headers: {
            ...buildCookiesHeader(cookies),
        },
    });

    return (await response.json()) as GetPostsResponse;
};

export function useDoomscroll(
    currentIndex: number,
    feedPreferences: FeedPreferences
) {
    const [uploads, setUploads] = useState<ItemResponse[]>([]);
    const [feed, setFeed] = useState<FeedItem[]>([]);

    const cookies = useAuth().cookies;

    /**
     * Clear everything on Neu/Beliebt switch
     */
    useEffect(() => {
        setUploads([]);
        setFeed([]);
    }, [feedPreferences.feed]);

    const { data, isLoading } = useSWR(
        () => ({
            contentType: feedPreferences.contentType,
            feed: feedPreferences.feed,
            baseUrl: `${BASE_URL}/api/items/get`,
            cookies,
        }),
        fetcher
    );

    useEffect(() => {
        if (!data?.items) {
            return;
        }

        const newUploads = data.items;

        setUploads((prevItems) => {
            const uniqueUploads = newUploads.filter(
                (item) => !prevItems.some((prevItem) => prevItem.id === item.id)
            );

            if (uniqueUploads.length === 0) {
                return prevItems;
            }

            if (prevItems.length > 0) {
                console.info("Found new uploads! Inserting them at cursor...");
                console.info(uniqueUploads);
                console.log(
                    "existing uploads before inserting new ones",
                    prevItems
                );
            }

            const after = prevItems.slice(currentIndex + 1);
            const before = prevItems.slice(0, currentIndex + 1);
            return [...before, ...uniqueUploads, ...after];
        });
    }, [data?.items, currentIndex]);

    //#region seed
    useEffect(() => {
        if (feed.length === 0 && uploads.length > 0) {
            setFeed(uploads.slice(0, TAKE_POSTS).map(buildFeedItem));
        }
    }, [feed.length, uploads]);
    //#endregion

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

    return { feed, loadMore, isLoading };
}

export type FeedItem = {
    id: number;
    src: string;
    benis: number;
    uploaderName: string;
    uploadedAt: Date;
    height: number;
    width: number;
    type: "video" | "image";
};

function buildFeedItem(res: ItemResponse): FeedItem {
    const type = res.image.includes("mp4") ? "video" : "image";
    return {
        id: res.id,
        src:
            type === "image"
                ? `https://img.pr0gramm.com/${res.image}`
                : `https://vid.pr0gramm.com/${res.image}`,
        uploadedAt: new Date(Number(res.created + "000")),
        uploaderName: res.user,
        benis: res.up - res.down,
        height: res.height,
        width: res.width,
        type,
    };
}
