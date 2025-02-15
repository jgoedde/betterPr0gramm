import { FC, useCallback, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCcw } from "lucide-react";
import { FullScreenSpinner } from "@/components/ui/spinner.tsx";

export const Image: FC<{ src: string }> = ({ src }) => {
    const [didFailToLoad, setDidFailToLoad] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const onImgError = useCallback(() => {
        setDidFailToLoad(true);
        setIsLoading(false);
    }, []);

    const onImgLoad = useCallback(() => setIsLoading(false), []);

    const reload = () => {
        setDidFailToLoad(false);
        setIsLoading(true);
    };

    if (didFailToLoad) {
        return (
            <div className="flex flex-col items-center space-y-2">
                <div className="text-white text-opacity-50">
                    Oops... That image did not load :(
                </div>
                <Button variant="outline" size="icon" onClick={reload}>
                    <RefreshCcw className="text-white" />
                </Button>
            </div>
        );
    }

    return (
        <>
            {isLoading && <FullScreenSpinner />}
            <img
                alt="Failed to load"
                src={src}
                className="w-full h-full max-w-full max-h-full object-contain"
                onError={onImgError}
                onLoad={onImgLoad}
            />
        </>
    );
};
