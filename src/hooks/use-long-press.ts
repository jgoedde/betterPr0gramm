import * as React from "react";
import { useCallback, useEffect, useRef } from "react";

type LongPressOptions = {
    onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
    onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
    delay?: number;
};

export function useLongPress({
    onLongPress,
    onClick,
    delay = 500,
}: LongPressOptions) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isLongPressActive = useRef(false);

    const startPressTimer = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            isLongPressActive.current = false;

            timerRef.current = setTimeout(() => {
                isLongPressActive.current = true;
                onLongPress(event);
            }, delay);
        },
        [onLongPress, delay]
    );

    const clearPressTimer = useCallback(
        (event: React.MouseEvent | React.TouchEvent, isCancel = false) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }

            if (!isCancel && !isLongPressActive.current && onClick) {
                onClick(event);
            }

            isLongPressActive.current = false;
        },
        [onClick]
    );

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return {
        onMouseDown: (event: React.MouseEvent) => startPressTimer(event),
        onMouseUp: (event: React.MouseEvent) => clearPressTimer(event),
        onMouseLeave: (event: React.MouseEvent) => clearPressTimer(event, true),
        onTouchStart: (event: React.TouchEvent) => startPressTimer(event),
        onTouchEnd: (event: React.TouchEvent) => clearPressTimer(event),
        onTouchCancel: (event: React.TouchEvent) =>
            clearPressTimer(event, true),
    };
}
