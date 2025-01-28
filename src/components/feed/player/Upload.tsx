import { useUploadInfo } from "@/components/feed/use-upload-info.ts";
import { FC, useMemo } from "react";
import { BottomBar } from "@/components/feed/player/BottomBar.tsx";
import { SideBar } from "@/components/feed/player/SideBar.tsx";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer.tsx";
import { FeedItem } from "../use-doomscroll";
import { Image } from "@/components/feed/player/Image.tsx";
import { Video } from "@/components/feed/player/Video.tsx";
import { CommentsDrawerContent } from "@/components/feed/comments/CommentsDrawerContent.tsx";
import { CommentsContextProvider } from "@/contexts/comments/CommentsContextProvider.tsx";

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
                        <DrawerTitle>{comments.length} Kommentare</DrawerTitle>
                    </DrawerHeader>
                    <div
                        className={
                            "flex flex-col justify-between h-[calc(100%-60px)]"
                        }
                    >
                        <CommentsDrawerContent
                            uploadId={upload.id}
                            revalidate={revalidate}
                        />
                    </div>
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
