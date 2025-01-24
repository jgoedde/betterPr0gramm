import { MessageSquareMore, MinusCircle, PlusCircle } from "lucide-react";
import { Upload } from "@/components/feed/Upload.ts";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { CommentThread } from "@/components/feed/comments/CommentThread.tsx";
import { useUploadInfo } from "@/components/feed/use-upload-info.ts";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { cn } from "@/lib/utils.ts";

type Props = { upload: Upload };

const DEFAULT_TAGS_SHOWN_COUNT = 2;

export const Video: FC<Props> = ({ upload }) => {
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

    const resume = useCallback(() => {
        void videoRef.current?.play();
        void blurredVideoRef.current?.play();
        setIsPlaying(true);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            resume();
        }
    }, [resume]);

    const [truncate, setTruncate] = useState<"truncate" | "">("");

    const formatTags = useCallback((list: string[]) => {
        return list.join(" • ");
    }, []);

    const topTag = useMemo(() => {
        const tag = tags[0]?.tag;
        if (tag == null) {
            return undefined;
        }
        return tag;
    }, [tags]);

    const otherTags = useMemo(() => {
        if (shouldShowAllTags) {
            return tags.filter((t) => t.tag !== topTag);
        }

        return tags
            .filter((t) => t.tag !== topTag)
            .filter((_, i) => i <= DEFAULT_TAGS_SHOWN_COUNT);
    }, [shouldShowAllTags, tags, topTag]);

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
        <Sheet>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Kommentare</SheetTitle>
                </SheetHeader>
                <div className={"h-full overflow-y-scroll"}>
                    <CommentThread comments={comments} />
                </div>
            </SheetContent>

            <div
                className={"absolute bottom-0 left-0 w-full p-2 z-10"}
                style={{
                    ...(shouldShowAllTags && {
                        boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 20px 20px",
                        background: "rgba(0,0,0,0.5)",
                    }),
                }}
            >
                <div
                    className={cn(
                        "flex-col w-5/6 text-white",
                        shouldShowAllTags && ""
                    )}
                >
                    <div>
                        {isLoading ? (
                            <>
                                <Skeleton className="h-4 w-48 mb-2" />
                                <Skeleton className="h-3 max-w-[360px]" />
                            </>
                        ) : (
                            <div className="font-bold text-lg">{topTag}</div>
                        )}
                    </div>
                    <div
                        className={cn(
                            "transition-all ease-in-out duration-1000",
                            truncate,
                            shouldShowAllTags
                                ? "max-h-[200px] overflow-y-scroll"
                                : "max-h-6"
                        )}
                    >
                        {formatTags(otherTags.map((t) => t.tag))}
                    </div>
                    <div className="flex w-full justify-end">
                        {!isLoading &&
                            otherTags.length > DEFAULT_TAGS_SHOWN_COUNT && (
                                <span
                                    className={"text-muted"}
                                    onClick={() =>
                                        setShouldShowAllTags((prev) => !prev)
                                    }
                                >
                                    {shouldShowAllTags ? "Weniger" : "Mehr"}
                                </span>
                            )}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 flex flex-col gap-1 z-10 p-2 text-white">
                <div className={"my-4"}>
                    <div
                        className={"flex flex-col items-center justify-center"}
                    >
                        <PlusCircle size={33} />
                        {upload.benis >= 1 && <span>{upload.benis}</span>}
                    </div>
                    <div
                        className={"flex flex-col items-center justify-center"}
                    >
                        <MinusCircle size={33} />
                        {upload.benis <= 0 && <span>{upload.benis}</span>}
                    </div>
                </div>
                <SheetTrigger asChild>
                    <div
                        className={"flex flex-col items-center justify-center"}
                    >
                        <MessageSquareMore size={33} />

                        {isLoading ? (
                            <Skeleton className={"h-2 w-4"} />
                        ) : (
                            <span>{comments.length}</span>
                        )}
                    </div>
                </SheetTrigger>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <video
                    ref={videoRef}
                    className="w-full h-full max-w-full max-h-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onClick={() => {
                        console.info("onClick foreground");
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
        </Sheet>
    );
};
