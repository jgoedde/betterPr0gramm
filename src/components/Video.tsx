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
import * as React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { CommentThread } from "@/components/CommentThread.tsx";
import { useUploadInfo } from "@/components/UseUploadInfo.ts";

export function Video({ upload }: { upload: Upload }) {
    const { tags, isLoading, comments } = useUploadInfo(upload.id);

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
            <video
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
                src={upload.src}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
            />

            <div
                className={
                    "absolute bottom-0 left-0 text-white flex-col p-2 z-10"
                }
            >
                <div>
                    {isLoading ? (
                        <div role="status" className="max-w-sm animate-pulse">
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
                            <div role="status" className="animate-pulse">
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
                    className="w-full h-full max-w-full max-h-full object-contain"
                    src={upload.src} // Replace with your video source
                    autoPlay
                    loop
                    muted
                    onClick={() => {
                        // TODO: Pause video
                    }}
                    playsInline
                />
            </div>
        </Sheet>
    );
}
