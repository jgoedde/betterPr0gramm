import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useMemo } from "react";

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
          extractNonce: () => string;
      }
    | {
          isAuthenticated: false;
          cookies: undefined;
          username: undefined;
          extractNonce: () => undefined;
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

    const extractNonce: () => string | undefined = useCallback(() => {
        return cookies?.me.id.slice(0, 16);
    }, [cookies?.me.id]);

    return {
        cookies,
        username,
        isAuthenticated,
        updateCookies,
        deleteCookies,

        // @ts-expect-error -- Safe to suppress this here since this is just TS complaining about the union type.
        extractNonce,
    };
}

export function buildCookiesHeader(cookies?: Cookies) {
    if (cookies == null) {
        return undefined;
    }

    return {
        "X-Cookies": `pp=${encodeURIComponent(cookies["pp"])}; me=${encodeURIComponent(JSON.stringify(cookies["me"]))}`,
    };
}
