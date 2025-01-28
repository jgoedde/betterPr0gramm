import { RefObject, useCallback, useEffect, useState } from "react";

export function useVideoControls({
    videoRef,
    blurredVideoRef,
}: {
    videoRef: RefObject<HTMLVideoElement>;
    blurredVideoRef: RefObject<HTMLVideoElement>;
}) {
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

    return { isMuted, isPlaying, mute, unMute, resume, pause };
}
