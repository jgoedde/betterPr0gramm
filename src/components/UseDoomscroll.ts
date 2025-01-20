import { Upload } from "@/Upload.ts";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

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

export function useDoomscroll(currentIndex: number) {
    const [seen, setSeen] = useState<{ postId: number; timestamp: Date }[]>([]);
    const [videos, setVideos] = useState<Upload[]>([]);
    const [feed, setFeed] = useState<Upload[]>([]);

    const { data } = useSWR("neu", async () => {
        //        const { data } = useSWR("beliebt", async () => {
        const response = await fetch(
            "https://pr0gramm.com/api/items/get?flags=1",
            // "https://pr0gramm.com/api/items/get?flags=1&promoted=1&show_junk=0",
            {
                method: "GET",
            }
        );

        return (await response.json()) as GetPostsResponse;
    });

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

            console.info(
                "Found new uploads! Inserting them at cursor...",
                uniqueUploads
            );

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
