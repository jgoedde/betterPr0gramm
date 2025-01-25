import useSWRImmutable from "swr/immutable";
import { buildCookiesHeader, Cookies, useAuth } from "@/hooks/use-auth.ts";
import { Fetcher } from "swr";
import { BASE_URL } from "@/api/pr0grammApi.ts";

const fetcher: Fetcher<GetProfileResponse, [string, Cookies]> = async ([
    url,
    cookies,
]) => {
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { ...buildCookiesHeader(cookies) },
    });

    return (await response.json()) as GetProfileResponse;
};

type CollectionResponse = {
    id: number;
    name: string;
    keyword: string;
    isPublic: number;
    isDefault: number;
    itemCount: number;
    items: { id: number; thumb: string; preview: string; flags: number }[];
};

type UploadResponse = {
    id: number;
    thumb: string;
    preview: string | null;
    flags: number;
};

type GetProfileResponse = {
    user: {
        id: number;
        name: string;
        score: number;
        mark: number;
    };
    uploads: UploadResponse[];
    uploadCount: number;
    collections: CollectionResponse[];
    collectedCount: number;
    tagCount: number;
};

export function useProfileInfo(nickname: string) {
    const { cookies } = useAuth();
    const { isLoading, data } = useSWRImmutable(
        [`${BASE_URL}/api/profile/info?name=${nickname}&flags=9`, cookies!],
        fetcher
    );

    return { isLoading, data };
}
