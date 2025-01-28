import { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export const CommentsLoadingSkeletons: FC = () => {
    return (
        <div className={"flex flex-col space-y-10 p-4"}>
            <div className={"flex flex-col space-y-1 w-full mt-8"}>
                <Skeleton className={"w-1/4 h-3"} />
                <Skeleton className={"w-3/4 h-3"} />
                <Skeleton className={"w-3/4 h-3"} />
                <Skeleton className={"w-1/4 h-3"} />
            </div>
            <div className={"flex flex-col space-y-1 w-full mt-4"}>
                <Skeleton className={"w-1/4 h-3"} />
                <Skeleton className={"w-4/4 h-3"} />
                <Skeleton className={"w-4/4 h-3"} />
                <Skeleton className={"w-2/4 h-3"} />
                <Skeleton className={"w-1/4 h-3"} />
            </div>
        </div>
    );
};