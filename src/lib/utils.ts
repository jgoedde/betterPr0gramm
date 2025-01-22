import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const ranks = [
    "Schwuchtel",
    "Neuschwuchtel",
    "Altschwuchtel",
    "Admin",
    "Gesperrt",
    "Moderator",
    "Fliesentischbesitzer",
    "Lebende Legende",
    "Wichtler",
    "Edler Spender",
    "Mittelaltschwuchtel",
    "Alt - Moderator",
    "Community - Helfer",
    "Nutzer - Bot",
    "System - Bot",
    "Alt - Helfer",
    "Blauschwuchtel",
    "Rotschwuchtel",
];

/**
 * Gets the string representation of a numerical rank.
 *
 * @throws Error when there is no rank found for provided mark.
 */
export function resolvePr0grammRank(mark: number): string {
    const rankStr: string | undefined = ranks[mark];

    if (!rankStr) {
        throw new Error("Unsupported rank");
    }

    return rankStr;
}
