import { FC } from "react";

export const Linkify: FC<{ text: string }> = ({ text }) => {
    const isUrl = (word: string) => {
        const urlPattern =
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        return RegExp(urlPattern).exec(word);
    };

    const addMarkup = (word: string) => {
        return isUrl(word)
            ? `<a class="text-orange-400" href="${word}" target="_blank">${word}</a>`
            : word;
    };

    const words = text.split(" ");
    const formatedWords = words.map((w) => addMarkup(w));
    const html = formatedWords.join(" ");
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
};
