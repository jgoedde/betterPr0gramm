import { useLocalStorage } from "@mantine/hooks";
import { useMemo } from "react";

export type Cookies = {
    me: { n: string; id: string; [key: string]: unknown };
    pp: string;
};

export function useAuth(): {
    updateCookies: (
        val:
            | Cookies
            | ((prevState: Cookies | undefined) => Cookies | undefined)
            | undefined
    ) => void;
    deleteCookies: () => void;
} & (
    | {
          isAuthenticated: true;
          cookies: Cookies;
          username: string;
      }
    | {
          isAuthenticated: false;
          cookies: undefined;
          username: undefined;
      }
) {
    const [cookies, updateCookies, deleteCookies] = useLocalStorage<
        Cookies | undefined
    >({
        key: "betterPr0gramm-cookies",
        getInitialValueInEffect: false,
    });

    const isAuthenticated: boolean = useMemo(() => {
        return cookies != null;
    }, [cookies]);

    const username: string | undefined = useMemo(() => {
        return cookies?.me?.n;
    }, [cookies]);

    // @ts-expect-error -- Safe to suppress this here since this is just TS complaining about the union type.
    return { cookies, username, isAuthenticated, updateCookies, deleteCookies };
}

export function buildCookiesHeader(cookies?: Cookies) {
    if (cookies == null) {
        return undefined;
    }

    return {
        "X-Cookies": `pp=${encodeURIComponent(cookies["pp"])}; me=${encodeURIComponent(JSON.stringify(cookies["me"]))}`,
    };
}
