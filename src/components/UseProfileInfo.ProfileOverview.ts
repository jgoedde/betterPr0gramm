import useSWRImmutable from "swr/immutable";
import { BASE_URL } from "@/components/api.ts";

const fetcher = async (url: string) => {
    const response = await fetch(url, {
        credentials: "include",
        method: "GET",
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
    const { isLoading, data } = useSWRImmutable(
        `${BASE_URL}/api/profile/info?name=${nickname}&flags=9`,
        fetcher
    ); // TODO: Should not be immutable but now for testing to not make so many requests...

    return { isLoading, data };
}
