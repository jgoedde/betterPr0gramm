import { FC, useCallback, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider.tsx";
import { useFeedContext } from "@/components/feed/context/FeedContext.ts";

export const VideoSeekbar: FC = () => {
    const {
        jumpToSecond,
        videoLengthSeconds,
        currentTime,
        isPlaying,
        currentUpload,
    } = useFeedContext();

    const [wasPlaying, setWasPlaying] = useState(false);
    const [value, setValue] = useState(0);
    const [isUserSeeking, setIsUserSeeking] = useState(false); // Track user interaction

    useEffect(() => {
        if (isPlaying) {
            setWasPlaying(true); // Mark that the video was playing
        }
    }, [isPlaying]);

    useEffect(() => {
        if (!videoLengthSeconds || isUserSeeking || !currentTime) {
            return;
        }

        setValue(currentTime);
    }, [currentTime, videoLengthSeconds, isUserSeeking]);

    const onSliderValueChange = useCallback(([second]: number[]) => {
        setValue(second);
        setIsUserSeeking(true);
    }, []);

    const onSliderValueCommit = useCallback(
        ([second]: number[]) => {
            setIsUserSeeking(false);
            setValue(second);
            jumpToSecond(second);
        },
        [jumpToSecond]
    );

    if (videoLengthSeconds == null) {
        return <></>;
    }

    return (
        <div
            className={`absolute bottom-0 w-full ${
                wasPlaying && isPlaying
                    ? "opacity-0 transition-opacity duration-500"
                    : "opacity-100"
            }`}
        >
            <Slider
                onValueChange={onSliderValueChange}
                onValueCommit={onSliderValueCommit}
                max={videoLengthSeconds}
                value={[value]}
                step={1}
                className={"w-full"}
            />
        </div>
    );
};
