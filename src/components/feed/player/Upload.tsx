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
import { CommentSection } from "../comments/CommentSection";
import { FeedItem } from "../use-doomscroll";
import { Image } from "@/components/feed/player/Image.tsx";
import { Video } from "@/components/feed/player/Video.tsx";

type Props = {
    upload: FeedItem;
    currentUploadId: number;
};

export const DEFAULT_TAGS_SHOWN_COUNT = 2;

export const Upload: FC<Props> = ({ upload, currentUploadId }) => {
    const { tags, isLoading, comments } = useUploadInfo(upload.id);

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
            <DrawerContent className={"h-4/6 text-foreground"}>
                <DrawerHeader>
                    <DrawerTitle>{comments.length} Kommentare</DrawerTitle>
                </DrawerHeader>
                <div className={"p-3 overflow-x-scroll overflow-y-scroll"}>
                    <CommentSection comments={comments} />
                </div>
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
                // isMuted={isMuted}
                // mute={mute}
                // unMute={unMute}
            />

            <div className="absolute inset-0 flex items-center justify-center">
                {slot}
            </div>
        </Drawer>
    );
};
