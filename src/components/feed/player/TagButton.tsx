import { useLongPress } from "@/hooks/use-long-press.ts";
import { FC } from "react";

type Props = {
    tag: string;
    id: number;
};

export const TagButton: FC<Props> = ({ tag, id }) => {
    const handlers = useLongPress({
        delay: 300,
        onLongPress: () => {
            console.info("Long pressed. Doing nothing...");
        },
        onClick: () => {},
    });
    return (
        <span {...handlers} className={"underline"}>
            {tag}
        </span>
    );
};
