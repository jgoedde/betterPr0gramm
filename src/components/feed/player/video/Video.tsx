import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useVideoControls } from "@/components/feed/player/video/use-video-controls.tsx";
import { usePlaybackContext } from "@/hooks/use-playback-context.ts";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCcw } from "lucide-react";

export const Video: FC<{
    src: string;
    uploadId: number;
    currentUploadId: number;
}> = ({ src, uploadId, currentUploadId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const blurredVideoRef = useRef<HTMLVideoElement>(null);
    const [didFailToLoad, setDidFailToLoad] = useState(false);

    const { resume, mute, unMute, isMuted, pause, isPlaying } =
        useVideoControls({ videoRef, blurredVideoRef });

    const { shouldPlayAudio } = usePlaybackContext();

    useEffect(() => {
        if (!videoRef.current) {
            return;
        }

        if (shouldPlayAudio && isMuted) {
            unMute();
        }
        if (!shouldPlayAudio && !isMuted) {
            mute();
        }
    }, [isMuted, mute, shouldPlayAudio, unMute]);

    const reload = useCallback(() => {
        setDidFailToLoad(false);

        if (videoRef.current) {
            videoRef.current.load();
            void resume();
        }
    }, [resume]);

    // This hook is responsible for pausing the video that we just swiped away and play the new one.
    useEffect(() => {
        if (currentUploadId === uploadId) {
            // Autoplay after 200ms
            setTimeout(() => {
                void resume();
            }, 200);
        } else {
            // Pause the other video after swipe
            pause();
        }
    }, [currentUploadId, pause, resume, uploadId]);

    const onVideoClick = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            void resume();
        }
    }, [isPlaying, pause, resume]);

    if (didFailToLoad) {
        return (
            <div className={"flex flex-col items-center space-y-2"}>
                <div className={"text-white text-opacity-50"}>
                    Oops... That video did not load :(
                </div>
                <Button variant={"outline"} size={"icon"} onClick={reload}>
                    <RefreshCcw className={"text-white"} />
                </Button>
            </div>
        );
    }

    return (
        <>
            <video
                ref={videoRef}
                className="w-full h-full max-w-full max-h-full object-contain"
                autoPlay
                loop
                muted={!shouldPlayAudio}
                playsInline
                onClick={onVideoClick}
                onError={() => {
                    setDidFailToLoad(true);
                    console.warn(
                        "Encountered an error while playing the video"
                    );
                    console.error(videoRef.current?.error?.code);
                }}
            >
                <source src={src} />
            </video>
            <video
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 -z-10"
                autoPlay
                loop
                ref={blurredVideoRef}
                muted
                playsInline
                onClick={onVideoClick}
            >
                <source src={src} />
            </video>
        </>
    );
};
