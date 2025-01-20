import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel.tsx";
import { Video } from "@/components/Video.tsx";
import { useDoomscroll } from "@/components/UseDoomscroll.ts";
import { useCallback, useEffect, useState } from "react";

export function HomeFeed() {
    const [api, setApi] = useState<CarouselApi>();
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const { videos, setAsSeen, loadMore } = useDoomscroll(currentSlide);

    /**
     * A slide animation was fulfilled. Either we jumped to the next or previous video.
     */
    const onSettle = useCallback(() => {
        setAsSeen(currentSlide);
        loadMore();
    }, [currentSlide, loadMore, setAsSeen]);

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
        <Carousel
            opts={{
                align: "start",
            }}
            orientation="vertical"
            className="w-full"
            setApi={setApi}
        >
            <CarouselContent className={"h-[calc(100vh-4rem)]"}>
                {videos.map((video) => (
                    <CarouselItem key={video.id} className="relative">
                        <Video upload={video} />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
