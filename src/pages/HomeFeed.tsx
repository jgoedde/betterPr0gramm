import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel.tsx";
import { Upload } from "@/components/feed/player/Upload.tsx";
import { TAKE_POSTS, useDoomscroll } from "@/components/feed/use-doomscroll.ts";
import { useCallback, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useFeedContext } from "@/components/feed/context/FeedContext.ts";
import { VideoSeekbar } from "@/components/feed/player/overlay/VideoSeekbar.tsx";

export function HomeFeed() {
    const [api, setApi] = useState<CarouselApi>();
    const { currentFeedIndex, setCurrentFeedIndex, setCurrentUpload } =
        useFeedContext();
    const { feed, loadMore, isLoading } = useDoomscroll(currentFeedIndex);

    /**
     * A slide animation was fulfilled. Either we jumped to the next or previous video/image.
     */
    const onSettle = useCallback(() => {
        if (feed.length - currentFeedIndex < TAKE_POSTS) {
            loadMore();
        }
    }, [currentFeedIndex, feed.length, loadMore]);

    const onSelect = useCallback(() => {
        if (!api) {
            return;
        }
        setCurrentFeedIndex(api.selectedScrollSnap());
    }, [api, setCurrentFeedIndex]);

    useEffect(() => {
        if (!api) {
            return;
        }

        onSelect();

        api.on("select", onSelect);
        api.on("settle", onSettle);

        return () => {
            api.off("settle", onSettle);
            api.off("select", onSelect);
        };
    }, [api, onSelect, onSettle]);

    useEffect(() => {
        const feedItem = feed[currentFeedIndex];
        if (feedItem) {
            setCurrentUpload(feedItem);
        }
    }, [currentFeedIndex, feed, setCurrentUpload]);

    return (
        <div className={"relative h-full"}>
            <Carousel
                opts={{
                    align: "start",
                }}
                orientation="vertical"
                className="w-full h-full"
                setApi={setApi}
            >
                <CarouselContent>
                    {feed.map((upload, index) => (
                        <CarouselItem
                            key={`upload-${upload.id}-${upload.occurrence.getTime()}`}
                            className="relative"
                        >
                            <Upload upload={upload} carouselIndex={index} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            {isLoading && feed.length === 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Spinner />
                </div>
            )}
            <VideoSeekbar />
        </div>
    );
}
