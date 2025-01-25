import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel.tsx";
import { Video } from "@/components/feed/player/Video.tsx";
import { useDoomscroll } from "@/components/feed/use-doomscroll.ts";
import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover.tsx";
import {
    SearchOptions,
    SearchPopoverForm,
} from "@/components/SearchPopoverForm.tsx";
import { SearchPopoverButton } from "@/components/SearchPopoverButton.tsx";

export function HomeFeed() {
    const [api, setApi] = useState<CarouselApi>();
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const { videos, setAsSeen, loadMore } = useDoomscroll(currentSlide);
    const [searchOptions, setSearchOptions] = useState<SearchOptions>({
        minimumBenis: 0,
        text: "",
        excludedText: "",
    });

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

    const applyFilters = useCallback(() => {}, []);

    return (
        <Popover
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    applyFilters();
                }
            }}
        >
            <PopoverContent className="w-80">
                <SearchPopoverForm
                    searchOptions={searchOptions}
                    setSearchOptions={setSearchOptions}
                />
            </PopoverContent>
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
                        {videos.map((video) => (
                            <CarouselItem key={video.id} className="relative">
                                <Video
                                    upload={video}
                                    currentVideoId={videos[currentSlide].id}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div
                    className={
                        "absolute top-2 right-2 bg-foreground p-1 rounded-lg"
                    }
                >
                    <SearchPopoverButton />
                </div>
            </div>
        </Popover>
    );
}
