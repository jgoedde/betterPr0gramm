import { Tag } from "@/components/feed/player/Tag.ts";
import { cn } from "@/lib/utils.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { FC, useMemo } from "react";
import { Badge } from "@/components/ui/badge.tsx";

type Props = {
    loading: boolean;
    tags: Tag[];
    uploader: string;
};

export const BottomBar: FC<Props> = ({ loading, tags, uploader }) => {
    const topTag = useMemo(() => {
        const tag = tags[0]?.name;
        if (tag == null) {
            return undefined;
        }
        return tag;
    }, [tags]);

    const otherTags = useMemo<Tag[]>(() => {
        return tags.filter((t) => t.name !== topTag);
    }, [tags, topTag]);

    return (
        <div
            className={"absolute bottom-0 left-0 w-full p-2 z-10"}
            style={{
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 20px 20px",
                background: "rgba(0,0,0,0.35)",
            }}
        >
            <div className={"flex-col w-5/6 text-white"}>
                <div className={"mb-3"}>
                    {loading ? (
                        <>
                            <Skeleton className="h-4 w-48 mb-2" />
                            <Skeleton className="h-3 max-w-[360px]" />
                        </>
                    ) : (
                        <>
                            <div className="font-bold text-lg">{topTag}</div>
                            <div className="">von {uploader}</div>
                        </>
                    )}
                </div>
                <div
                    className={cn(
                        "overflow-x-auto flex flex-wrap flex-col h-8 space-x-2"
                    )}
                >
                    {otherTags.map((t) => (
                        <Badge key={"tag-" + t.id} variant={"secondary"}>
                            {t.name}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
};
