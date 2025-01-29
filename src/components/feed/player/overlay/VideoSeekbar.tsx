import { FC } from "react";
import { useVideoControls } from "@/components/feed/player/video/use-video-controls.tsx";
import { Slider } from "@/components/ui/slider.tsx";

export const VideoSeekbar: FC = () => {
    const { jumpToSecond } = useVideoControls();

    return (
        <Slider
            onValueCommit={(j) => {
                const seconds = j[0]; // 0 because we have no range here...
                jumpToSecond(seconds);
            }}
            defaultValue={[0]}
            max={100}
            step={1}
            className={"w-full"}
        />
    );
};