import { buildCookiesHeader, Cookies, useAuth } from "@/hooks/use-auth.ts";
import useSWR, { Fetcher } from "swr";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast.ts";
import { isEmpty } from "lodash";

class NotAuthenticatedError extends Error {
    constructor() {
        super("Authentication failed with requested credentials.");
    }
}

const fetcher: Fetcher<GetProfileResponse, [string, Cookies]> = async ([
    url,
    cookies,
]) => {
    const response = await fetch(url, {
        method: "GET",
        headers: { ...buildCookiesHeader(cookies) },
    });

    if (response.status === 403) {
        throw new NotAuthenticatedError();
    }

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

export function useProfileInfo() {
    const { cookies, deleteCookies, username } = useAuth();
    const { isLoading, data, error } = useSWR(
        isEmpty(username)
            ? null
            : [
                  `${BASE_URL}/api/profile/info?name=${username}&flags=9`,
                  cookies,
              ],
        fetcher
    );
    const { toast } = useToast();

    useEffect(() => {
        if (error instanceof NotAuthenticatedError) {
            console.warn(
                "The pr0gramm API did not accept the sent cookie headers. Please login again."
            );
            toast({
                title: "Something went wrong",
                description:
                    "The pr0gramm API did not accept the sent cookie headers. Please login again.",
            });
            deleteCookies();
        }
    }, [deleteCookies, error, toast]);

    return { isLoading, data };
}
