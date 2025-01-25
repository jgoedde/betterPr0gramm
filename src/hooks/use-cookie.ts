import { useMemo, useState } from "react";
import Cookies from "js-cookie";

export function useCookie<T>(name: string) {
    const [cookieStr] = useState(Cookies.get(name));

    const cookieValJson = useMemo<T | undefined>(() => {
        if (cookieStr == null) {
            return undefined;
        }
        try {
            return JSON.parse(cookieStr);
        } catch (e) {
            if (e instanceof Error) {
                console.error("Encountered an error while parsing cookie", e);
            }
            return undefined;
        }
    }, [cookieStr]);

    return { cookieValJson };
}
