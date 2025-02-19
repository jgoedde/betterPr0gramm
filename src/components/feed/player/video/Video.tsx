import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCcw } from "lucide-react";
import { FullScreenSpinner } from "@/components/ui/spinner.tsx";
import { useFeedContext } from "@/components/feed/context/FeedContext.ts";

export const Video: FC<{
    src: string;
    uploadId: number;
    carouselIndex: number;
}> = ({ src, uploadId, carouselIndex }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const {
        currentUploadId,
        isMuted,
        play,
        pause,
        isPlaying,
        currentFeedIndex,
    } = useFeedContext();

    useEffect(
        function syncMuted() {
            if (!videoRef.current) {
                return;
            }

            videoRef.current.muted = isMuted;
        },
        [isMuted]
    );

    const onReloadButtonClick = useCallback(() => {
        if (videoRef.current) {
            setHasError(false);
            setIsLoading(true);

            videoRef.current.load();
            play();
        }
    }, [play]);

    useEffect(() => {
        if (!videoRef.current) {
            return;
        }

        if (currentUploadId === uploadId) {
            // Autoplay after 200ms
            setTimeout(() => {
                if (!videoRef.current) {
                    return;
                }

                void videoRef.current.play();
            }, 200);
        } else {
            // Pause the other video after swipe
            videoRef.current.pause();
        }
    }, [currentUploadId, pause, play, uploadId]);

    useEffect(
        function syncPlaying() {
            if (!videoRef.current) {
                return;
            }

            if (currentUploadId !== uploadId) {
                return;
            }

            if (isPlaying) {
                void videoRef.current.play();
            } else {
                videoRef.current?.pause();
            }
        },
        [currentUploadId, isPlaying, uploadId]
    );

    const onVideoClick = useCallback(() => {
        if (isLoading || !videoRef.current) {
            return;
        }

        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isLoading, isPlaying, pause, play]);

    const onVideoError = useCallback(() => {
        console.warn("Encountered an error while playing the video");
        console.error(videoRef.current?.error?.code);

        setHasError(true);
        setIsLoading(false);
    }, []);

    const handleVisibilityChange = useCallback(() => {
        if (document.hidden) {
            videoRef.current?.pause();
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
        [handleVisibilityChange]
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

    if (currentFeedIndex - carouselIndex > 2) {
        return <></>;
    }

    return (
        <>
            {isLoading && <FullScreenSpinner />}
            <video
                ref={videoRef}
                className="w-full h-full max-w-full max-h-full object-contain"
                loop
                autoPlay
                muted={isMuted}
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
