import { Upload } from "@/components/feed/Upload.ts";
import { useUploadInfo } from "@/components/feed/use-upload-info.ts";
import { FC, useEffect, useRef } from "react";
import { BottomBar } from "@/components/feed/player/BottomBar.tsx";
import { SideBar } from "@/components/feed/player/SideBar.tsx";
import { useVideoControls } from "@/components/feed/player/use-video-controls.ts";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer.tsx";
import { CommentSection } from "../comments/CommentSection";

type Props = { upload: Upload; currentVideoId: number };

export const DEFAULT_TAGS_SHOWN_COUNT = 2;

export const Video: FC<Props> = ({ upload, currentVideoId }) => {
    const { tags, isLoading, comments } = useUploadInfo(upload.id);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { resume, mute, unMute, isMuted, pause, isPlaying } =
        useVideoControls(videoRef);

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
                loading={isLoading}
                commentResponses={comments as never[]}
                isMuted={isMuted}
                mute={mute}
                unMute={unMute}
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
        </Drawer>
    );
};
