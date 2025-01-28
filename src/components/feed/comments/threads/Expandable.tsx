import { Separator } from "@/components/ui/separator.tsx";
import { FC } from "react";

type Props = {
    onClick: () => void;
    text: string;
};

export const Panel: FC<Props> = ({ onClick, text }) => (
    <div className={"flex items-center text-muted-foreground space-x-2 mt-2"}>
        <Separator className={"flex-none w-12"} />
        <div
            onClick={onClick}
            className={"grow flex items-center space-x-1 cursor-pointer"}
        >
            <span>{text}</span>
        </div>
    </div>
);
