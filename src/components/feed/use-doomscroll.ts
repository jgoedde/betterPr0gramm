import { Upload } from "@/components/feed/Upload.ts";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import useSWR, { Fetcher } from "swr";
import { buildCookiesHeader, Cookies, useAuth } from "@/hooks/use-auth.ts";

type ItemResponse = {
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

const TAKE_VIDEOS = 3;

const fetcher: Fetcher<
    GetPostsResponse,
    [string, Cookies | undefined]
> = async ([url, cookies]) => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            ...buildCookiesHeader(cookies),
        },
    });

    return (await response.json()) as GetPostsResponse;
};

export function useDoomscroll(currentIndex: number) {
    const [seen, setSeen] = useState<{ postId: number; timestamp: Date }[]>([]);
    const [videos, setVideos] = useState<Upload[]>([]);
    const [feed, setFeed] = useState<Upload[]>([]);

    const cookies = useAuth().cookies;

    /* only while developing */
    const { data } = useSWR(
        ["neu", `${BASE_URL}/api/items/get?flags=1`, cookies],
        ([, url]) => fetcher([url, cookies])
    );

    useEffect(() => {
        if (!data?.items) {
            return;
        }

        const newUploads = data.items.filter(onlyMp4s).map(toUpload);

        setVideos((prevVideos) => {
            const uniqueUploads = newUploads.filter(
                (item) => !prevVideos.some((video) => video.id === item.id)
            );

            if (uniqueUploads.length === 0) {
                return prevVideos;
            }

            if (prevVideos.length > 0) {
                console.info("Found new uploads! Inserting them at cursor...");
                console.info(uniqueUploads);
                console.log(
                    "existing videos before inserting new ones",
                    prevVideos
                );
            }

            const after = prevVideos.slice(currentIndex + 1);
            const before = prevVideos.slice(0, currentIndex + 1);
            return [...before, ...uniqueUploads, ...after];
        });
    }, [data?.items, currentIndex]);

    //#region seed
    useEffect(() => {
        if (feed.length === 0 && videos.length > 0) {
            setFeed(videos.slice(0, TAKE_VIDEOS));
        }
    }, [feed.length, videos]);
    //#endregion

    function toUpload(res: ItemResponse): Upload {
        return {
            id: res.id,
            src: `https://vid.pr0gramm.com/${res.image}`,
            uploadedAt: new Date(Number(res.created + "000")),
            uploaderName: res.user,
            benis: res.up - res.down,
        };
    }

    const setAsSeen = useCallback(
        (videoId: number) => {
            if (seen.find((x) => x.postId === videoId)) {
                return;
            }

            setSeen((prev) => [
                ...prev,
                { postId: videoId, timestamp: new Date() },
            ]);
        },
        [seen]
    );

    const loadMore = useCallback(() => {
        setFeed((prev) =>
            [
                ...prev, // ## This prevents layout shifts ##
                ...videos.slice(currentIndex, currentIndex + TAKE_VIDEOS),
            ].filter(onlyUnique)
        );
    }, [currentIndex, videos]);

    return { videos: feed, setAsSeen, loadMore };
}

function onlyUnique<T>(value: T, index: number, array: T[]) {
    return array.indexOf(value) === index;
}

function onlyMp4s(media: ItemResponse) {
    return media.image.includes(".mp4");
}
