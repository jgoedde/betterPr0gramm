import { FC, ReactNode, useMemo } from "react";
import {
    NavigationContext,
    View,
} from "@/contexts/navigation/NavigationContext.ts";
import { useSessionStorage } from "react-use";

export const NavigationProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [view, setView] = useSessionStorage<View>(
        "betterPr0gramm-view",
        "home"
    );

    const value = useMemo(() => ({ view, setView }), [setView, view]);

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};
