import { FC, useEffect, useRef } from "react";
import { useVideoControls } from "@/components/feed/player/use-video-controls.tsx";
import { usePlaybackContext } from "@/hooks/use-playback-context.ts";

export const Video: FC<{
    src: string;
    uploadId: number;
    currentUploadId: number;
}> = ({ src, uploadId, currentUploadId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { resume, mute, unMute, isMuted, pause, isPlaying } =
        useVideoControls(videoRef);

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

    return (
        <video
            ref={videoRef}
            className="w-full h-full max-w-full max-h-full object-contain"
            autoPlay
            loop
            muted={!shouldPlayAudio}
            playsInline
            onClick={() => {
                if (isPlaying) {
                    pause();
                } else {
                    void resume();
                }
            }}
        >
            <source src={src} />
        </video>
    );
};
