import { Tag } from "@/components/feed/player/Tag.tsx";
import { cn } from "@/lib/utils.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { TagButton } from "@/components/feed/player/TagButton.tsx";
import { DEFAULT_TAGS_SHOWN_COUNT } from "@/components/feed/player/Video.tsx";
import * as React from "react";
import { FC } from "react";

type Props = {
    shouldShowAllTags: boolean;
    loading: boolean;
    topTag: undefined | string;
    inputs: "truncate" | "";
    tags: Tag[];
    setShouldShowAllTags: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BottomBar: FC<Props> = ({
    inputs,
    loading,
    setShouldShowAllTags,
    shouldShowAllTags,
    tags,
    topTag,
}) => {
    return (
        <div
            className={"absolute bottom-0 left-0 w-full p-2 z-10"}
            style={{
                ...(shouldShowAllTags && {
                    boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 20px 20px",
                    background: "rgba(0,0,0,0.5)",
                }),
            }}
        >
            <div
                className={cn(
                    "flex-col w-5/6 text-white",
                    shouldShowAllTags && ""
                )}
            >
                <div>
                    {loading ? (
                        <>
                            <Skeleton className="h-4 w-48 mb-2" />
                            <Skeleton className="h-3 max-w-[360px]" />
                        </>
                    ) : (
                        <div className="font-bold text-lg">{topTag}</div>
                    )}
                </div>
                <div
                    className={cn(
                        "transition-all ease-in-out duration-1000",
                        inputs,
                        shouldShowAllTags
                            ? "max-h-[200px] overflow-y-scroll"
                            : "max-h-6"
                    )}
                >
                    {tags.map((t) => (
                        <span key={t.id}>
                            <TagButton tag={t.name} id={t.id} />
                            {" • "}
                        </span>
                    ))}
                </div>
                <div className="flex w-full justify-end">
                    {!loading && tags.length > DEFAULT_TAGS_SHOWN_COUNT && (
                        <span
                            className={"text-white text-opacity-75"}
                            onClick={() =>
                                setShouldShowAllTags((prev) => !prev)
                            }
                        >
                            {shouldShowAllTags ? "Weniger" : "Mehr"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
