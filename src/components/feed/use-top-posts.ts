import { usePreferences } from "@/components/feed/use-preferences.ts";
import { buildCookiesHeader, Cookies, useAuth } from "@/hooks/use-auth.ts";
import useSWR, { Fetcher } from "swr";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import { useMemo } from "react";

export type ItemResponse = {
    height: number;
    width: number;
    id: number;
    up: number;
    down: number;
    created: number;
    image: string;
    user: string;
};
type GetPostsResponse = {
    items: ItemResponse[];
};
type CacheKey = {
    contentType: number;
    feed: "beliebt" | "neu";
    baseUrl: string;
    cookies: Cookies | undefined;
};
const fetcher: Fetcher<GetPostsResponse, CacheKey> = async ({
    contentType,
    baseUrl,
    cookies,
    feed,
}) => {
    const urlSearchParams = new URLSearchParams({
        flags: String(contentType),
        ...(feed === "beliebt" && { promoted: "1" }),
        showJunk: String(false),
    });

    const response = await fetch(`${baseUrl}?${urlSearchParams.toString()}`, {
        method: "GET",
        headers: {
            ...buildCookiesHeader(cookies),
        },
    });

    return (await response.json()) as GetPostsResponse;
};

export function useTopPosts() {
    const { preferences } = usePreferences();
    const { cookies } = useAuth();

    const cacheKey = useMemo(() => {
        return {
            contentType: preferences.contentType,
            feed: "beliebt",
            baseUrl: `${BASE_URL}/api/items/get`,
            cookies,
        } as CacheKey;
    }, [cookies, preferences.contentType]);

    const { data, isLoading, mutate } = useSWR(cacheKey, fetcher);

    return { topPosts: data, isLoading, revalidate: () => void mutate() };
}
