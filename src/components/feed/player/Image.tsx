import { FC } from "react";

export const Image: FC<{ src: string }> = ({ src }) => {
    return (
        <img
            alt={`TODO`}
            src={src}
            className="w-full h-full max-w-full max-h-full object-contain"
        />
    );
};