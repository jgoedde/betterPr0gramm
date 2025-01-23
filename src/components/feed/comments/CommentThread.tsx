export const CommentThread = ({
    comments,
}: {
    comments: {
        id: number;
        parent: number;
        content: string;
        name: string;
        created: number;
        up: number;
        down: number;
    }[];
}) => {
    return (
        <pre className={"font-mono w-full text-wrap"}>
            {JSON.stringify(comments, null, 2)}
        </pre>
    );
};
