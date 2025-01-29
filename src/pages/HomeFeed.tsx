import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel.tsx";
import { Upload } from "@/components/feed/player/Upload.tsx";
import { useDoomscroll } from "@/components/feed/use-doomscroll.ts";
import { useCallback, useEffect, useState } from "react";
import { usePreferences } from "@/components/feed/use-preferences.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { ContentTypeSelector } from "@/components/feed/ContentTypeSelector.tsx";
import { VideoSeekbar } from "@/components/feed/player/overlay/VideoSeekbar.tsx";

export function HomeFeed() {
    const [api, setApi] = useState<CarouselApi>();
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const { preferences } = usePreferences();
    const { feed, loadMore, isLoading } = useDoomscroll(
        currentSlide,
        preferences
    );

    useEffect(() => {
        if (!api) {
            return;
        }

        api.scrollTo(0);
    }, [api, preferences.feed]);

    /**
     * A slide animation was fulfilled. Either we jumped to the next or previous video/image.
     */
    const onSettle = useCallback(() => {
        loadMore();
    }, [loadMore]);

    const onSelect = useCallback(() => {
        if (!api) {
            return;
        }
        setCurrentSlide(api.selectedScrollSnap());
    }, [api]);

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
                    {feed.map((upload) => (
                        <CarouselItem
                            key={`carousel-item-upload-${upload.id}`}
                            className="relative"
                        >
                            <Upload
                                key={`upload-${upload.id}`}
                                upload={upload}
                                currentUploadId={feed[currentSlide].id}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            {isLoading && feed.length === 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Spinner />
                </div>
            )}
            <div className={"absolute top-2 left-1/2 -translate-x-1/2"}>
                <ContentTypeSelector />
            </div>

            <div className={"absolute bottom-0 w-full"}>
                <VideoSeekbar />
            </div>
        </div>
    );
}
