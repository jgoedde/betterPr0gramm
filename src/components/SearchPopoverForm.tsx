import { Dispatch, FC, SetStateAction } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Minus, Plus } from "lucide-react";

export type SearchOptions = {
    minimumBenis: number;
    text: string;
    excludedText: string;
};

type Props = {
    searchOptions: SearchOptions;
    setSearchOptions: Dispatch<SetStateAction<SearchOptions>>;
};
export const SearchPopoverForm: FC<Props> = ({
    searchOptions,
    setSearchOptions,
}) => {
    return (
        <div className="grid gap-4">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Suche</h4>
                <p className="text-sm text-muted-foreground">
                    Was möchtest du gerne sehen?
                </p>
            </div>
            <div>
                <label
                    htmlFor="text-input"
                    className="block mb-1 text-sm font-medium"
                >
                    Tags
                </label>
                <Input
                    id={"text-input"}
                    className={
                        "border-0 border-b focus-visible:ring-0 rounded-none"
                    }
                    autoFocus={true}
                    placeholder={"alles und jeder hat Depression"}
                    value={searchOptions.text}
                    onChange={(event) =>
                        setSearchOptions((prev) => ({
                            ...prev,
                            text: event.target.value,
                        }))
                    }
                />
            </div>
            <div>
                <label
                    htmlFor="excluded-text-input"
                    className="block mb-1 text-sm font-medium"
                >
                    Ausgeschlossene Tags
                </label>
                <Input
                    id={"excluded-text-input"}
                    className={
                        "border-0 border-b focus-visible:ring-0 rounded-none"
                    }
                    placeholder={"kadse"}
                    value={searchOptions.excludedText}
                    onChange={(event) =>
                        setSearchOptions((prev) => ({
                            ...prev,
                            excludedText: event.target.value,
                        }))
                    }
                />
            </div>
            <div>
                <label
                    htmlFor="min-benis-input"
                    className="block mb-1 text-sm font-medium"
                >
                    Minimum Benis
                </label>
                <div className="relative flex items-center w-36 gap-1">
                    <Button
                        variant={"ghost"}
                        size={"sm"}
                        type="button"
                        id="increment-button"
                        onClick={() => {
                            setSearchOptions((prev) => ({
                                ...prev,
                                minimumBenis: prev.minimumBenis - 100,
                            }));
                        }}
                        data-input-counter-increment="min-benis-input"
                    >
                        <Minus />
                    </Button>
                    <span className="w-8 text-center">
                        {searchOptions.minimumBenis}
                    </span>
                    <Button
                        type="button"
                        size={"sm"}
                        variant={"ghost"}
                        id="decrement-button"
                        data-input-counter-decrement="min-benis-input"
                        onClick={() => {
                            setSearchOptions((prev) => ({
                                ...prev,
                                minimumBenis: prev.minimumBenis + 100,
                            }));
                        }}
                    >
                        <Plus />
                    </Button>
                </div>
            </div>
        </div>
    );
};
