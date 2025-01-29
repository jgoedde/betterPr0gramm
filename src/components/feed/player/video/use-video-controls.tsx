import { useCallback, useEffect, useState } from "react";
import { usePlaybackContext } from "@/hooks/use-playback-context.ts";

export function useVideoControls() {
    const { videoRef, blurredVideoRef } = usePlaybackContext();
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState<boolean>(false);

    const mute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
        }
    }, [videoRef]);

    const unMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
        }
    }, [videoRef]);

    useEffect(() => {
        if (videoRef.current) {
            setIsMuted(videoRef.current.muted);
        }
    }, [videoRef]);

    const pause = useCallback(() => {
        videoRef.current?.pause();
        blurredVideoRef.current?.pause();
        setIsPlaying(false);
    }, [blurredVideoRef, videoRef]);

    const resume = useCallback(async () => {
        await videoRef.current?.play();
        await blurredVideoRef.current?.play();
        setIsPlaying(true);
    }, [blurredVideoRef, videoRef]);

    const jumpToSecond = useCallback(
        (second: number) => {
            if (videoRef.current && blurredVideoRef.current) {
                videoRef.current.currentTime =
                    blurredVideoRef.current.currentTime = second;
            }
        },
        [blurredVideoRef, videoRef]
    );

    return { isMuted, isPlaying, mute, unMute, resume, pause, jumpToSecond };
}
