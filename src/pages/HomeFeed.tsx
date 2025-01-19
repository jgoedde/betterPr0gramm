import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel.tsx";
import { Video } from "@/components/Video.tsx";
import { useMedia } from "@/components/UseMedia.ts";
import { useCallback, useEffect, useState } from "react";

export function HomeFeed() {
    const { videos } = useMedia();
    const [api, setApi] = useState<CarouselApi>();
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [renderedVideos, setRenderedVideos] = useState(videos.slice(0, 3)); // Initially render 3 videos

    //#region Seed renderedVideos arr
    useEffect(() => {
        if (renderedVideos.length === 0 && videos.length > 0) {
            setRenderedVideos(videos.slice(0, 3));
        }
    }, [renderedVideos.length, videos]);
    //#endregion

    const appendVideos = useCallback(() => {
        const nextIndex = currentSlide + 1;
        const nextBatch = videos.slice(0, nextIndex + 2); // Load the current, next, and one more video
        setRenderedVideos(nextBatch);
    }, [currentSlide, videos]);

    useEffect(() => {
        if (!api) {
            return;
        }

        const setCurrentSlideIndex = () => {
            setCurrentSlide(api.selectedScrollSnap() + 1);
        };

        setCurrentSlideIndex();

        api.on("select", setCurrentSlideIndex);
        api.on("settle", appendVideos);

        return () => {
            api.off("settle", appendVideos);
            api.off("select", setCurrentSlideIndex);
        };
    }, [api, currentSlide, videos, appendVideos]);

    return (
        <Carousel
            opts={{
                align: "start",
            }}
            orientation="vertical"
            className="w-full"
            setApi={setApi}
        >
            <CarouselContent className={"h-[calc(100vh-4rem)]"}>
                {renderedVideos.map((video) => (
                    <CarouselItem key={video.id} className="relative">
                        <Video upload={video} />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
