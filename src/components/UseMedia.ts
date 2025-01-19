import { Upload } from "@/Upload.ts";
import { useMemo } from "react";
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

export function useMedia() {
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

    function toUpload(res: ItemResponse): Upload {
        return {
            id: res.id,
            src: `https://vid.pr0gramm.com/${res.image}`,
            uploadedAt: new Date(Number(res.created + "000")),
            uploaderName: res.user,
            benis: res.up - res.down,
        };
    }

    const videos = useMemo<Upload[]>(() => {
        const videoResponses =
            data?.items.filter((media) => media.image.includes(".mp4")) ?? [];
        return videoResponses.map(toUpload);
    }, [data?.items]);

    return { videos };
}
