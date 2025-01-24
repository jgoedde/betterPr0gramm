import { Upload } from "@/components/feed/Upload.ts";
import { useUploadInfo } from "@/components/feed/use-upload-info.ts";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tag } from "@/components/feed/player/Tag.tsx";
import { BottomBar } from "@/components/feed/player/BottomBar.tsx";
import { SideBar } from "@/components/feed/player/SideBar.tsx";

type Props = { upload: Upload; currentVideoId: number };

export const DEFAULT_TAGS_SHOWN_COUNT = 2;

export const Video: FC<Props> = ({ upload, currentVideoId }) => {
    const { tags, isLoading, comments } = useUploadInfo(upload.id);
    const [isPlaying, setIsPlaying] = useState(true);
    const [shouldShowAllTags, setShouldShowAllTags] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const blurredVideoRef = useRef<HTMLVideoElement>(null);

    const pause = useCallback(() => {
        videoRef.current?.pause();
        blurredVideoRef.current?.pause();
        setIsPlaying(false);
    }, []);

    const resume = useCallback(async () => {
        await videoRef.current?.play();
        await blurredVideoRef.current?.play();
        setIsPlaying(true);
    }, []);

    const [truncate, setTruncate] = useState<"truncate" | "">("");

    const topTag = useMemo(() => {
        const tag = tags[0]?.tag;
        if (tag == null) {
            return undefined;
        }
        return tag;
    }, [tags]);

    const toTag = useCallback(
        (res: (typeof tags)[0]): Tag => ({ name: res.tag, id: res.id }),
        []
    );

    const otherTags = useMemo<Tag[]>(() => {
        if (shouldShowAllTags) {
            return tags.filter((t) => t.tag !== topTag).map(toTag);
        }

        return tags
            .filter((t) => t.tag !== topTag)
            .filter((_, i) => i <= DEFAULT_TAGS_SHOWN_COUNT)
            .map(toTag);
    }, [shouldShowAllTags, tags, toTag, topTag]);

    // This hook is responsible for pausing the video that we just swiped away and play the new one.
    useEffect(() => {
        if (currentVideoId === upload.id) {
            // Autoplay after 200ms
            setTimeout(() => {
                void resume();
            }, 200);
        } else {
            // Pause the other video after swipe
            pause();
        }
    }, [currentVideoId, pause, resume, upload.id]);

    // Gross...
    useEffect(() => {
        if (!shouldShowAllTags) {
            setTimeout(() => {
                setTruncate("truncate");
            }, 1000);
        } else {
            setTruncate("");
        }
    }, [shouldShowAllTags]);

    return (
        <>
            <BottomBar
                shouldShowAllTags={shouldShowAllTags}
                setShouldShowAllTags={setShouldShowAllTags}
                loading={isLoading}
                topTag={topTag}
                inputs={truncate}
                tags={otherTags}
            />

            <SideBar
                uploadId={upload.id}
                benis={upload.benis}
                loading={isLoading}
                commentResponses={comments as never[]}
            />

            <div className="absolute inset-0 flex items-center justify-center">
                <video
                    ref={videoRef}
                    className="w-full h-full max-w-full max-h-full object-contain"
                    autoPlay
                    loop
                    playsInline
                    onClick={() => {
                        if (isPlaying) {
                            pause();
                        } else {
                            resume();
                        }
                    }}
                >
                    <source src={upload.src} />
                </video>
            </div>
        </>
    );
};
