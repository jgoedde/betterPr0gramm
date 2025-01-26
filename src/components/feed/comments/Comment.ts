export type Comment = {
    id: number;
    parent: number;
    content: string;
    created: Date;
    up: number;
    down: number;
    name: string;
};
