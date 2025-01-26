import useSWRImmutable from "swr/immutable";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import { buildCookiesHeader, Cookies, useAuth } from "@/hooks/use-auth.ts";
import { Fetcher } from "swr";

type TagResponse = { id: number; confidence: number; tag: string };
type CommentResponse = {
    id: number;
    parent: number;
    content: string;
    name: string;
    created: number;
    up: number;
    down: number;
};
type GetInfoResponse = {
    tags: TagResponse[];
    comments: CommentResponse[];
};
const fetcher: Fetcher<
    GetInfoResponse,
    [string, Cookies | undefined]
> = async ([url, cookies]) => {
    console.log("trying to cache " + url);

    return await new Promise<GetInfoResponse>((res) => {
        setTimeout(
            () =>
                res({
                    tags: [
                        {
                            id: Math.floor(Math.random() * 100000),
                            confidence: 1,
                            tag: "Test",
                        },
                    ],
                    comments: [],
                } as GetInfoResponse),
            Math.random() * 3000
        );
    });

    /*
    const response = await fetch(url, {
        method: "GET",
        headers: {
            ...buildCookiesHeader(cookies),
        },
    });

    await new Promise((res) => {
        setTimeout(res, Math.random() * 3000);
    });

    return (await response.json()) as GetInfoResponse;

     */
};

export function useUploadInfo(uploadId: number) {
    const cookies = useAuth().cookies;

    const { data, isLoading } = useSWRImmutable(
        [`${BASE_URL}/api/items/info?itemId=${uploadId}`, cookies],
        fetcher
    );

    return {
        tags: data?.tags ?? [],
        comments: data?.comments ?? [],
        isLoading,
    };
}
