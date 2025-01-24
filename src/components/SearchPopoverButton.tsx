import { ChevronDown, Search } from "lucide-react";
import { FC } from "react";
import { PopoverTrigger } from "@/components/ui/popover.tsx";

export const SearchPopoverButton: FC = () => {
    return (
        <PopoverTrigger asChild>
            <div className={"flex items-center"}>
                <div className={"relative"}>
                    <Search size={"16px"} className={"text-background ml-1"} />

                    {/*<span className="-top-1 start-4 absolute w-3.5 h-3.5 bg-secondary border-2 border-primary rounded-full"></span>*/}
                </div>
                <div className={"relative"}>
                    <ChevronDown
                        size={"26px"}
                        className={"text-background ml-1"}
                    />
                    {/*<span className="top-0 start-5 absolute w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"></span>*/}
                </div>
            </div>
        </PopoverTrigger>
    );
};
