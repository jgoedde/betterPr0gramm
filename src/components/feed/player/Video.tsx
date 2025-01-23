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
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { cn } from "@/lib/utils.ts";

type Props = { upload: Upload };

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

            {/*<BlurredFullscreenVideo*/}
            {/*    videoRef={blurredVideoRef}*/}
            {/*    src={upload.src}*/}
            {/*/>*/}

            <div className={"absolute bottom-0 left-0 flex-col p-2 z-10 w-5/6"}>
                <div
                    onClick={() => {
                        setShouldShowAllTags((prev) => !prev);
                    }}
                >
                    <div>
                        {isLoading ? (
                            <>
                                <Skeleton className="h-4 w-48 mb-2" />
                                <Skeleton className="h-3 max-w-[360px]" />
                            </>
                        ) : (
                            <div className="font-bold text-lg">
                                {tags[0].tag}
                            </div>
                        )}
                    </div>
                    <div
                        className={cn(
                            "transition-all ease-in-out duration-800 overflow-hidden",
                            shouldShowAllTags ? "max-h-[200px]" : "max-h-6"
                        )}
                    >
                        {tags
                            .filter((_, i) => i !== 0)
                            .map((t) => t.tag)
                            .join(", ")}
                    </div>
                </div>

                {/*AUTHOR. VIELLEICHT BRAUCHT DAS GAR NICHT...*/}
                {/*<div className={"mt-2"}>*/}
                {/*    <span>*/}
                {/*        <span className={"font-bold"}>*/}
                {/*            {upload.uploaderName}*/}
                {/*        </span>*/}
                {/*        ,{" "}*/}
                {/*    </span>*/}
                {/*    <span className={""}>*/}
                {/*        {formatDistanceToNow(upload.uploadedAt, {*/}
                {/*            addSuffix: true,*/}
                {/*        })}*/}
                {/*    </span>*/}
                {/*</div>*/}
            </div>

            <div className="absolute bottom-0 right-0 flex flex-col gap-1 z-10 p-2">
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
