import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useVideoControls } from "@/components/feed/player/video/use-video-controls.tsx";
import { usePlaybackContext } from "@/hooks/use-playback-context.ts";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCcw } from "lucide-react";
import { FullScreenSpinner } from "@/components/ui/spinner.tsx";

export const Video: FC<{
    src: string;
    uploadId: number;
    currentUploadId: number;
}> = ({ src, uploadId, currentUploadId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { resume, mute, unMute, isMuted, pause, isPlaying } =
        useVideoControls({ videoRef });

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

    const onReloadButtonClick = useCallback(() => {
        if (videoRef.current) {
            setHasError(false);
            setIsLoading(true);

            videoRef.current.load();
            void resume();
        }
    }, [resume]);

    useEffect(
        function playVideo() {
            if (currentUploadId === uploadId) {
                // Autoplay after 200ms
                setTimeout(() => {
                    void resume();
                }, 200);
            } else {
                // Pause the other video after swipe
                pause();
            }
        },
        [currentUploadId, pause, resume, uploadId]
    );

    const onVideoClick = useCallback(() => {
        if (isLoading) {
            return;
        }

        if (isPlaying) {
            pause();
        } else {
            void resume();
        }
    }, [isLoading, isPlaying, pause, resume]);

    const onVideoError = useCallback(() => {
        console.warn("Encountered an error while playing the video");
        console.error(videoRef.current?.error?.code);

        setHasError(true);
        setIsLoading(false);
    }, []);

    const handleVisibilityChange = useCallback(() => {
        if (document.hidden) {
            pause();
        }
    }, [pause]);

    useEffect(
        function pauseVideoOnVisibilityChange() {
            document.addEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

            return () => {
                document.removeEventListener(
                    "visibilitychange",
                    handleVisibilityChange
                );
            };
        },
        [handleVisibilityChange, pause]
    );

    if (hasError) {
        return (
            <div className={"flex flex-col items-center space-y-2"}>
                <div className={"text-white text-opacity-50"}>
                    Oops... That video did not load :(
                </div>
                <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={onReloadButtonClick}
                >
                    <RefreshCcw className={"text-white"} />
                </Button>
            </div>
        );
    }

    return (
        <>
            {isLoading && <FullScreenSpinner />}
            <video
                ref={videoRef}
                className="w-full h-full max-w-full max-h-full object-contain"
                autoPlay
                loop
                muted={!shouldPlayAudio}
                playsInline
                onClick={onVideoClick}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onError={onVideoError}
            >
                <source src={src} />
            </video>
        </>
    );
};
