import { Tag } from "@/components/feed/player/Tag.tsx";
import { cn } from "@/lib/utils.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { TagButton } from "@/components/feed/player/TagButton.tsx";
import { DEFAULT_TAGS_SHOWN_COUNT } from "@/components/feed/player/Video.tsx";
import { FC, useEffect, useMemo, useState } from "react";

type Props = {
    loading: boolean;
    tags: Tag[];
};

export const BottomBar: FC<Props> = ({ loading, tags }) => {
    const [shouldShowAllTags, setShouldShowAllTags] = useState(false);
    const [truncate, setTruncate] = useState<"truncate" | "">("");

    const topTag = useMemo(() => {
        const tag = tags[0]?.name;
        if (tag == null) {
            return undefined;
        }
        return tag;
    }, [tags]);

    const otherTags = useMemo<Tag[]>(() => {
        if (shouldShowAllTags) {
            return tags.filter((t) => t.name !== topTag);
        }

        return tags
            .filter((t) => t.name !== topTag)
            .filter((_, i) => i <= DEFAULT_TAGS_SHOWN_COUNT);
    }, [shouldShowAllTags, tags, topTag]);

    // Gross...
    useEffect(() => {
        if (!shouldShowAllTags) {
            setTimeout(() => {
                setTruncate("truncate");
            }, 1000);
        } else {
            setTruncate("");
        }
    }, [shouldShowAllTags]);

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
                        truncate,
                        shouldShowAllTags
                            ? "max-h-[200px] overflow-y-scroll"
                            : "max-h-6"
                    )}
                >
                    {otherTags.map((t) => (
                        <span key={t.id}>
                            <TagButton tag={t.name} id={t.id} />
                            {" • "}
                        </span>
                    ))}
                </div>
                <div className="flex w-full justify-end">
                    {!loading &&
                        otherTags.length > DEFAULT_TAGS_SHOWN_COUNT && (
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
