import { FC, Ref } from "react";

type Props = {
    ref: Ref<HTMLVideoElement>;
    src: string;
};

export const BlurredFullscreenVideo: FC<Props> = ({ ref, src }) => (
    <video
        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
        autoPlay
        loop
        ref={ref}
        muted
        playsInline
    >
        <source src={src} />
    </video>
);
