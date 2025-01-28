import { useUploadInfo } from "@/components/feed/use-upload-info.ts";
import { FC, useMemo } from "react";
import { BottomBar } from "@/components/feed/player/overlay/BottomBar.tsx";
import { SideBar } from "@/components/feed/player/overlay/SideBar.tsx";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer.tsx";
import { FeedItem } from "../use-doomscroll";
import { Image } from "@/components/feed/player/image/Image.tsx";
import { Video } from "@/components/feed/player/video/Video.tsx";
import { CommentsDrawerContent } from "@/components/feed/comments/CommentsDrawerContent.tsx";
import { CommentsContextProvider } from "@/components/feed/comments/context/CommentsContextProvider.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { CommentsLoadingSkeletons } from "@/components/feed/comments/CommentsLoadingSkeletons.tsx";

type Props = {
    upload: FeedItem;
    currentUploadId: number;
};

export const Upload: FC<Props> = ({ upload, currentUploadId }) => {
    const { tags, isLoading, comments, revalidate } = useUploadInfo(upload.id);

    const slot = useMemo(() => {
        if (upload.type === "video") {
            return (
                <Video
                    key={`video-${upload.id}`}
                    currentUploadId={currentUploadId}
                    uploadId={upload.id}
                    src={upload.src}
                />
            );
        }

        return <Image key={`image-${upload.id}`} src={upload.src} />;
    }, [currentUploadId, upload.id, upload.src, upload.type]);

    return (
        <Drawer>
            <DrawerContent className={"h-5/6 text-foreground"}>
                <CommentsContextProvider comments={comments}>
                    <DrawerHeader>
                        <DrawerTitle>
                            {isLoading ? (
                                <Skeleton
                                    className={"justify-self-center w-36 h-3"}
                                />
                            ) : (
                                <span>{comments.length} Kommentare</span>
                            )}
                        </DrawerTitle>
                    </DrawerHeader>

                    {isLoading ? (
                        <CommentsLoadingSkeletons />
                    ) : (
                        <CommentsDrawerContent
                            uploadId={upload.id}
                            revalidate={revalidate}
                        />
                    )}
                </CommentsContextProvider>
            </DrawerContent>
            <BottomBar
                tags={tags}
                loading={isLoading}
                uploader={upload.uploaderName}
            />
            <SideBar
                uploadId={upload.id}
                benis={upload.benis}
                isLoading={isLoading}
                comments={comments as never[]}
                uploadType={upload.type}
            />

            <div className="absolute inset-0 flex items-center justify-center">
                {slot}
            </div>
        </Drawer>
    );
};
