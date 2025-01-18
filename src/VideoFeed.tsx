import { CarouselItem } from "@/components/ui/carousel.tsx";
import { Video } from "@/components/Video.tsx";
import { Upload } from "@/Upload.ts";

export function VideoFeed({ videos }: { videos: Upload[] }) {
  return videos.map((video) => (
    <CarouselItem key={video.id} className="relative">
      <Video upload={video} />
    </CarouselItem>
  ));
}
