import { useLocalStorage } from "react-use";

export type Cookies = {
    me: { n: string; id: string; [key: string]: unknown };
    pp: string;
};

export function useAuth() {
    const [cookies, updateCookies, deleteCookies] = useLocalStorage<Cookies>(
        "betterPr0gramm-cookies"
    );

    return { cookies, updateCookies, deleteCookies };
}

export function buildCookiesHeader(cookies?: Cookies) {
    if (cookies == null) {
        return undefined;
    }

    return {
        "X-Cookies": `pp=${encodeURIComponent(cookies["pp"])}; me=${encodeURIComponent(JSON.stringify(cookies["me"]))}`,
    };
}
