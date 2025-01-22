import { MessageSquareMore, MinusCircle, PlusCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Upload } from "@/Upload.ts";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { ScrollArea } from "./ui/scroll-area";
import { CommentThread } from "@/components/CommentThread.tsx";
import { useUploadInfo } from "@/components/UseUploadInfo.ts";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { BlurredFullscreenVideo } from "@/components/BlurredFullscreenVideo.tsx";

type Props = { upload: Upload };

export const Video: FC<Props> = ({ upload }) => {
    const { tags, isLoading, comments } = useUploadInfo(upload.id);
    const [isPlaying, setIsPlaying] = useState(true);
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
                <ScrollArea className={"h-full my-4"}>
                    <CommentThread comments={comments} parentId={0} />
                </ScrollArea>
            </SheetContent>

            <BlurredFullscreenVideo
                videoRef={blurredVideoRef}
                src={upload.src}
            />

            <div
                className={
                    "absolute bottom-0 left-0 text-white flex-col p-2 z-10"
                }
            >
                <div>
                    {isLoading ? (
                        <div className="max-w-sm animate-pulse">
                            <div className="h-3 bg-gray-200 rounded-full w-48 mb-2"></div>
                            <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
                        </div>
                    ) : (
                        <>
                            <span className={"text-xl font-bold"}>
                                {tags[0].tag}
                            </span>{" "}
                            <span className={"text-muted"}>
                                +{tags.length - 1}
                            </span>
                        </>
                    )}
                </div>

                <div>
                    <span>{upload.uploaderName}, </span>
                    <span className={"text-muted"}>
                        {formatDistanceToNow(upload.uploadedAt, {
                            addSuffix: true,
                        })}
                    </span>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 flex flex-col gap-1 z-10 text-white p-2">
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
                            <div className="animate-pulse">
                                <div className="h-2 bg-gray-200 rounded-full w-4"></div>
                            </div>
                        ) : (
                            <span>{comments.length}</span>
                        )}
                    </div>
                </SheetTrigger>
            </div>

            {/* Optional Overlay */}
            {/*<div className="absolute inset-0 bg-black bg-opacity-50"></div>*/}
            {/* Foreground Video */}
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
