import { Upload } from "@/Upload.ts";
import video1 from "/test1.mp4";
import video2 from "/test2.mp4";
import video3 from "/test3.mp4";
import { useCallback, useState } from "react";

export function useMedia() {
  const [videos, setVideos] = useState<Upload[]>([
    {
      id: "123",
      src: video1,
      benis: 314,
      topTag: "Mit Essen spielt man",
      uploaderName: "RundesBalli",
      commentsCount: 23,
      uploadedAt: new Date(2024, 2, 2, 3, 2, 1),
    },
    {
      id: "124",
      src: video2,
      benis: 23,
      topTag: "Oile",
      uploaderName: "JuiceCS",
      uploadedAt: new Date(2024, 7, 2, 3, 2, 1),
      commentsCount: 23,
    },
    {
      id: "125",
      src: video3,
      benis: 121,
      topTag: "Umfall",
      uploaderName: "Gaamb",
      commentsCount: 23,
      uploadedAt: new Date(2024, 11, 2, 3, 2, 1),
    },
  ]);

  const loadMore = useCallback(() => {
    setVideos((prev) => [
      ...prev,
      { ...prev[0], id: `${Math.floor(Math.random() * 1000)}` },
    ]);
  }, []);

  return { videos, loadMore };
}
