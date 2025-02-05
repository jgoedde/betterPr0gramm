import { ItemResponse } from "@/components/feed/use-top-posts.ts";

export type FeedItem = {
    id: number;
    src: string;
    benis: number;
    uploaderName: string;
    uploadedAt: Date;
    height: number;
    width: number;
    type: "video" | "image";

    /**
     * When this item was played into the feed
     */
    occurrence: Date;
};

export function buildFeedItem(res: ItemResponse): FeedItem {
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
        occurrence: new Date(),
    };
}
