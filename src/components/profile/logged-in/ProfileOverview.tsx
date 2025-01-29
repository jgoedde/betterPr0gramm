import { FC } from "react";
import { Separator } from "@/components/ui/separator.tsx";
import { CircleUserRound, Video } from "lucide-react";
import styles from "./ProfileOverview.module.css";
import { resolvePr0grammRank } from "@/lib/utils.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { useProfileInfo } from "@/components/profile/logged-in/use-profile-info.ts";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/hooks/use-auth.ts";

export const ProfileOverview: FC = () => {
    const { username: nickname } = useAuth();

    const { isLoading, data } = useProfileInfo();

    return (
        <div className={"flex flex-col h-full"}>
            <div className={"w-full text-center text-xl font-bold py-2"}>
                {nickname}
            </div>
            <Separator />
            <div className={"flex flex-col mb-2"}>
                <CircleUserRound className={"size-20 my-2 mx-auto"} />
                <div className={"mx-auto font-semibold"}>@{nickname}</div>
                <div className="flex flex-row gap-6 justify-center my-3">
                    <div className={styles.stat}>
                        <div className={styles.number}>
                            {isLoading ? (
                                <Skeleton className="w-[60px] h-[20px] rounded-full" />
                            ) : (
                                data?.uploadCount
                            )}
                        </div>
                        <div>Hochlads</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.number}>
                            {isLoading ? (
                                <Skeleton className="w-[60px] h-[20px] rounded-full" />
                            ) : (
                                data?.user.score
                            )}
                        </div>
                        <div>Benis</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.number}>
                            {isLoading ? (
                                <Skeleton className="w-[60px] h-[20px] rounded-full" />
                            ) : (
                                data?.collectedCount
                            )}
                        </div>
                        <div>Gesammelt</div>
                    </div>
                </div>
                <div className="flex justify-center">
                    {isLoading ? (
                        <Skeleton className="w-[100px] h-[20px] rounded-full" />
                    ) : (
                        data && (
                            <Badge>
                                {resolvePr0grammRank(data?.user.mark)}
                            </Badge>
                        )
                    )}
                </div>
            </div>
            <Tabs
                defaultValue="uploads"
                className="w-full p-2 flex flex-col grow"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="uploads">Hochlads</TabsTrigger>
                    <TabsTrigger value="saved">Gesammelt</TabsTrigger>
                </TabsList>
                <TabsContent value="uploads" className={styles.tabContent}>
                    <div className={styles.videoGrid}>
                        {isLoading ? (
                            <>
                                <Skeleton className={styles.gridItemSkeleton} />
                                <Skeleton className={styles.gridItemSkeleton} />
                                <Skeleton className={styles.gridItemSkeleton} />
                                <Skeleton className={styles.gridItemSkeleton} />
                            </>
                        ) : (
                            data?.uploads.map((upload) => (
                                <PostGridItem
                                    key={`grid-upload-${upload.id}`}
                                    id={upload.id}
                                    preview={upload.preview ?? undefined}
                                    thumb={upload.thumb}
                                />
                            ))
                        )}
                    </div>
                    {!isLoading && data && (
                        <div className={"flex mt-3 justify-center"}>
                            <Button>Show all uploads</Button>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="saved" className={styles.tabContent}>
                    <div className={styles.videoGrid}>
                        {isLoading ? (
                            <>
                                <Skeleton className={styles.gridItemSkeleton} />
                                <Skeleton className={styles.gridItemSkeleton} />
                                <Skeleton className={styles.gridItemSkeleton} />
                                <Skeleton className={styles.gridItemSkeleton} />
                            </>
                        ) : (
                            data?.collections
                                .flatMap((c) => c.items)
                                .map(({ id, preview, thumb }) => (
                                    <PostGridItem
                                        key={`grid-collection-item-${id}`}
                                        id={id}
                                        preview={preview ?? undefined}
                                        thumb={thumb}
                                    />
                                ))
                        )}
                    </div>
                    {!isLoading && data && (
                        <div className={"flex mt-3 justify-center"}>
                            <Button>Show all saved posts</Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

const PostGridItem: FC<{ id: number; thumb: string; preview?: string }> = ({
    preview,
    thumb,
    //id,
}) => {
    return (
        <div className={"relative"}>
            <img
                src={`https://thumb.pr0gramm.com/${thumb}`}
                className={"w-full h-full"}
                alt={`https://thumb.pr0gramm.com/${thumb}`}
            />
            {preview != null && (
                <div className={"absolute bottom-2 right-2 bg-primary rounded"}>
                    <Video className={"p-1 text-secondary"} />
                </div>
            )}
        </div>
    );
};
