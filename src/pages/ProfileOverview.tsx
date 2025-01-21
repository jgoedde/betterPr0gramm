import { FC } from "react";
import { BASE_URL } from "@/components/api.ts";
import { Separator } from "@/components/ui/separator.tsx";
import useSWRImmutable from "swr/immutable";

const fetcher = async (url: string) => {
    const response = await fetch(url, {
        credentials: "include",
        method: "GET",
    });

    return (await response.json()) as GetProfileResponse;
};

type GetProfileResponse = {
    user: {
        id: number;
        name: string;
        isSameTeam: boolean;
        registered: number;
        score: number;
        up: number;
        down: number;
        mark: number;
        banned: number;
        bannedUntil: null;
        commentDelete: number;
        itemDelete: number;
        inactive: number;
        canReceiveMessages: boolean;
    };
    comments: {
        id: number;
        up: number;
        down: number;
        content: string;
        created: number;
        itemId: number;
        thumb: string;
    }[];
    commentCount: number;
    likesArePublic: boolean;
    comments_likes: {
        id: number;
        up: number;
        down: number;
        content: string;
        created: number;
        ccreated: number;
        itemId: number;
        thumb: string;
        userId: number;
        mark: number;
        name: string;
    }[];
    commentLikesCount: number;
    uploads: { id: number; thumb: string; preview: null; flags: number }[];
    uploadCount: number;
    pr0mium: number;
    pr0miumGift: number;
    collections: {
        id: number;
        name: string;
        keyword: string;
        isPublic: number;
        isDefault: number;
        itemCount: number;
        items: { id: number; thumb: string; preview: string; flags: number }[];
    }[];
    collectedCount: number;
    tagCount: number;
    background: null;
    followCount: number;
    following: boolean;
    subscribed: boolean;
    blocked: boolean;
    ts: number;
    cache: null;
    rt: number;
    qc: number;
};

export const ProfileOverview: FC<{ nickname: string }> = ({ nickname }) => {
    const { isLoading, data } = useSWRImmutable(
        `${BASE_URL}/api/profile/info?name=${nickname}&flags=9`,
        fetcher
    ); // TODO: Should not be immutable but now for testing to not make so many requests...

    console.log(isLoading, "isLoading");
    console.log(data, "data");

    return (
        <>
            <div className={"w-full text-center text-xl font-semibold py-2"}>
                {nickname}
            </div>
            <Separator />
        </>
    );
};
