import {
  Carousel,
  CarouselApi,
  CarouselContent,
} from "./components/ui/carousel";
import { VideoFeed } from "@/VideoFeed.tsx";
import { useEffect, useState } from "react";
import { useMedia } from "@/components/UseMedia.ts";
import { ListVideo, SlidersHorizontal, User } from "lucide-react";

function App() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState<number>();

  const { loadMore, videos } = useMedia();

  useEffect(() => {
    if (!currentSlide) {
      return;
    }

    if (currentSlide >= videos.length - 2) {
      loadMore();
    }
  }, [currentSlide, loadMore, videos.length]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent className={"h-[calc(100vh-4rem)]"}>
          <VideoFeed videos={videos} />
        </CarouselContent>
      </Carousel>
      <div className="z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center font-medium px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <SlidersHorizontal
              className={
                "w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
              }
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Einstellungen
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center font-medium px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <ListVideo
              className={
                "w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
              }
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Feed
            </span>
          </button>
          <button
            type="button"
            className="inline-flex flex-col items-center justify-center font-medium px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <User
              className={
                "w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
              }
            />
            <span className="text-sm max-w-28 truncate text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              JuiceCS
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
