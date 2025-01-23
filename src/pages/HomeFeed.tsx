import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel.tsx";
import { Video } from "@/components/feed/player/Video.tsx";
import { useDoomscroll } from "@/components/feed/use-doomscroll.ts";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Minus, Plus, Search } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

export function HomeFeed() {
    const [api, setApi] = useState<CarouselApi>();
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const { videos, setAsSeen, loadMore } = useDoomscroll(currentSlide);
    const [searchOptions, setSearchOptions] = useState<{
        minimumBenis: number;
        text: string;
        excludedText: string;
    }>({ minimumBenis: 0, text: "", excludedText: "" });

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
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Suche</h4>
                        <p className="text-sm text-muted-foreground">
                            Was möchtest du gerne sehen?
                        </p>
                    </div>
                    <div>
                        <label
                            htmlFor="text-input"
                            className="block mb-1 text-sm font-medium"
                        >
                            Tags
                        </label>
                        <Input
                            id={"text-input"}
                            className={
                                "border-0 border-b focus-visible:ring-0 rounded-none"
                            }
                            autoFocus={true}
                            placeholder={"alles und jeder hat Depression"}
                            value={searchOptions.text}
                            onChange={(event) =>
                                setSearchOptions((prev) => ({
                                    ...prev,
                                    text: event.target.value,
                                }))
                            }
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="excluded-text-input"
                            className="block mb-1 text-sm font-medium"
                        >
                            Ausgeschlossene Tags
                        </label>
                        <Input
                            id={"excluded-text-input"}
                            className={
                                "border-0 border-b focus-visible:ring-0 rounded-none"
                            }
                            placeholder={"kadse"}
                            value={searchOptions.excludedText}
                            onChange={(event) =>
                                setSearchOptions((prev) => ({
                                    ...prev,
                                    excludedText: event.target.value,
                                }))
                            }
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="min-benis-input"
                            className="block mb-1 text-sm font-medium"
                        >
                            Minimum Benis
                        </label>
                        <div className="relative flex items-center w-36 gap-1">
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                type="button"
                                id="increment-button"
                                onClick={() => {
                                    setSearchOptions((prev) => ({
                                        ...prev,
                                        minimumBenis: prev.minimumBenis - 100,
                                    }));
                                }}
                                data-input-counter-increment="min-benis-input"
                            >
                                <Minus />
                            </Button>
                            <span className="w-8 text-center">
                                {searchOptions.minimumBenis}
                            </span>
                            <Button
                                type="button"
                                size={"sm"}
                                variant={"ghost"}
                                id="decrement-button"
                                data-input-counter-decrement="min-benis-input"
                                onClick={() => {
                                    setSearchOptions((prev) => ({
                                        ...prev,
                                        minimumBenis: prev.minimumBenis + 100,
                                    }));
                                }}
                            >
                                <Plus />
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
            <div className={"relative"}>
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
                <div
                    className={
                        "absolute top-2 right-2 bg-foreground p-1 rounded-lg"
                    }
                >
                    <PopoverTrigger asChild>
                        <div className={"flex items-center"}>
                            <div className={"relative"}>
                                <Search
                                    size={"16px"}
                                    className={"text-background ml-1"}
                                />

                                {/*<span className="-top-1 start-4 absolute w-3.5 h-3.5 bg-secondary border-2 border-primary rounded-full"></span>*/}
                            </div>
                            <div className={"relative"}>
                                <ChevronDown
                                    size={"26px"}
                                    className={"text-background ml-1"}
                                />
                                {/*<span className="top-0 start-5 absolute w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"></span>*/}
                            </div>
                        </div>
                    </PopoverTrigger>
                </div>
            </div>
        </Popover>
    );
}
