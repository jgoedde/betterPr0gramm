import mitt from "mitt";

export type Emitter = { "seekbar-let-go": { seconds: number } };

export const emitter = mitt<Emitter>();
