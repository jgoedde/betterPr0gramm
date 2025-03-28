import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Play, RefreshCcw } from "lucide-react";
import { FullScreenSpinner } from "@/components/ui/spinner.tsx";
import { useFeedContext } from "@/components/feed/context/FeedContext.ts";
import { Emitter, emitter } from "@/emitter.ts";

export const Video: FC<{
    src: string;
    uploadId: number;
    carouselIndex: number;
}> = ({ src, uploadId, carouselIndex }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const updateCurrentTimeInterval = useRef<NodeJS.Timeout>();

    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const {
        currentUpload,
        isMuted,
        play,
        pause,
        isPlaying,
        currentFeedIndex,
        setCurrentTime,
        setVideoLengthSeconds,
    } = useFeedContext();

    useEffect(
        function setCurrentTimeOnSeekbarLetGo() {
            const handleEvent = ({ seconds }: Emitter["seekbar-let-go"]) => {
                if (!videoRef.current || currentUpload?.id !== uploadId) {
                    return;
                }

                videoRef.current.currentTime = seconds;
            };

            emitter.on("seekbar-let-go", handleEvent);

            return () => emitter.off("seekbar-let-go", handleEvent);
        },
        [currentUpload?.id, uploadId]
    );

    useEffect(
        function syncCurrentTime() {
            if (!videoRef.current || currentUpload?.id !== uploadId) {
                return;
            }

            const updateCurrentTime = () => {
                setCurrentTime(videoRef.current!.currentTime);
            };

            if (isPlaying) {
                updateCurrentTimeInterval.current = setInterval(
                    updateCurrentTime,
                    500
                );

                return () => clearInterval(updateCurrentTimeInterval.current);
            } else {
                updateCurrentTime(); // Ensure last position is stored on pause
            }
        },
        [isPlaying, currentUpload?.id, uploadId, setCurrentTime]
    );

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
        } else {
            location.reload();
        }
    }, [play]);

    useEffect(() => {
        if (!videoRef.current) {
            return;
        }

        if (currentUpload?.id === uploadId) {
            // Autoplay after 200ms
            setTimeout(() => {
                if (!videoRef.current) {
                    return;
                }

                play();
                setVideoLengthSeconds(videoRef.current.duration);
            }, 200);
        } else {
            // Pause the other video after swipe
            videoRef.current.pause();
        }
    }, [currentUpload?.id, play, setVideoLengthSeconds, uploadId]);

    useEffect(
        function syncPlaying() {
            if (!videoRef.current) {
                return;
            }

            if (currentUpload?.id !== uploadId) {
                return;
            }

            if (isPlaying) {
                void videoRef.current.play();
            } else {
                videoRef.current?.pause();
            }
        },
        [currentUpload?.id, isPlaying, uploadId]
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
            {!isLoading && !isPlaying && !hasError && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-opacity-35">
                    <Play onClick={onVideoClick} size={44} />
                </div>
            )}
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
