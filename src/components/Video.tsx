import { MessageSquareMore, MinusCircle, PlusCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Upload } from "@/Upload.ts";
import useSWR from "swr";

type TagResponse = { id: number; confidence: number; tag: string };
type CommentResponse = never;

type GetInfoResponse = {
    tags: TagResponse[];
    comments: CommentResponse[];
};
const fetcher = async (url: string) => {
    console.log("trying to cache " + url);

    return await new Promise<GetInfoResponse>((res) => {
        setTimeout(
            () =>
                res({
                    tags: [
                        {
                            id: Math.floor(Math.random() * 100000),
                            confidence: 1,
                            tag: "Test",
                        },
                    ],
                    comments: [],
                } as GetInfoResponse),
            Math.random() * 3000
        );
    });

    /*
    const response = await fetch(url, {
        method: "GET",
    });

    await new Promise((res) => {
        setTimeout(res, Math.random() * 3000);
    });

    return (await response.json()) as GetInfoResponse;
     */
};

function useUploadInfo(uploadId: number) {
    const { data, isLoading } = useSWR(
        `https://pr0gramm.com/api/items/info?itemId=${uploadId}`,
        fetcher
    );

    return {
        tags: data?.tags ?? [],
        comments: data?.comments ?? [],
        isLoading,
    };
}

export function Video({ upload }: { upload: Upload }) {
    const { tags, isLoading, comments } = useUploadInfo(upload.id);

    return (
        <>
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
                <div className={"flex flex-col items-center justify-center"}>
                    <MessageSquareMore size={33} />
                    {isLoading ? (
                        <div role="status" className="animate-pulse">
                            <div className="h-2 bg-gray-200 rounded-full w-4"></div>
                        </div>
                    ) : (
                        <span>{comments.length}</span>
                    )}
                </div>
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
        </>
    );
}
