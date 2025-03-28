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
import { Image } from "@/components/feed/player/image/Image.tsx";
import { Video } from "@/components/feed/player/video/Video.tsx";
import { CommentsDrawerContent } from "@/components/feed/comments/CommentsDrawerContent.tsx";
import { CommentsContextProvider } from "@/components/feed/comments/context/CommentsContextProvider.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { CommentsLoadingSkeletons } from "@/components/feed/comments/CommentsLoadingSkeletons.tsx";
import { FeedItem } from "@/components/feed/FeedItem.ts";

type Props = {
    upload: FeedItem;
    carouselIndex: number;
};

export const Upload: FC<Props> = ({ upload, carouselIndex }) => {
    const { isLoading, comments, revalidate } = useUploadInfo(upload.id);

    const slot = useMemo(() => {
        if (upload.type === "video") {
            return (
                <Video
                    uploadId={upload.id}
                    src={upload.src}
                    carouselIndex={carouselIndex}
                />
            );
        }

        return <Image src={upload.src} />;
    }, [carouselIndex, upload.id, upload.src, upload.type]);

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
            <BottomBar uploader={upload.uploaderName} uploadId={upload.id} />
            <SideBar
                uploadId={upload.id}
                benis={upload.benis}
                uploadType={upload.type}
            />

            <div className="absolute inset-0 flex items-center justify-center">
                {slot}
            </div>
        </Drawer>
    );
};
