import { useCallback, useContext } from "react";
import {
    NavigationContext,
    View,
} from "@/contexts/navigation/NavigationContext.ts";

export function useNavigation() {
    const nav = useContext(NavigationContext);

    const goTo = useCallback(
        (newView: View) => {
            if (!nav) {
                throw new Error("NavigationProvider not present");
            }

            nav.setView(newView);
        },
        [nav]
    );

    if (!nav) {
        throw new Error("NavigationProvider not present");
    }

    return { view: nav.view, goTo };
}
