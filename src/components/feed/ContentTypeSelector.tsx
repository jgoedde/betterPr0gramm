import { usePreferences } from "@/components/feed/use-preferences.ts";
import { cn } from "@/lib/utils.ts";
import { Activity, ChartColumnIncreasing } from "lucide-react";
import styles from "./ContentTypeSelector.module.css";

export function ContentTypeSelector() {
    const { preferences, setFeed } = usePreferences();

    return (
        <div className={"flex flex-row gap-5 text-lg text-white"}>
            <button
                className={cn(styles.selectorButton)}
                onClick={() => setFeed("beliebt")}
            >
                <ChartColumnIncreasing
                    className={cn(
                        preferences.feed === "beliebt"
                            ? styles.iconSelected
                            : styles.iconUnselected
                    )}
                />
                <span
                    className={cn(
                        preferences.feed === "beliebt"
                            ? styles.textSelected
                            : styles.textUnselected
                    )}
                >
                    Beliebt
                </span>
            </button>
            <button
                className={cn(styles.selectorButton)}
                onClick={() => setFeed("neu")}
            >
                <Activity
                    className={cn(
                        preferences.feed === "neu"
                            ? styles.iconSelected
                            : styles.iconUnselected
                    )}
                />
                <span
                    className={cn(
                        preferences.feed === "neu"
                            ? styles.textSelected
                            : styles.textUnselected
                    )}
                >
                    Neu
                </span>
            </button>
        </div>
    );
}
