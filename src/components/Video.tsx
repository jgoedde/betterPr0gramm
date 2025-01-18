import { MessageSquareMore, MinusCircle, PlusCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Upload } from "@/Upload.ts";

export function Video({ upload }: { upload: Upload }) {
  return (
    <>
      <video
        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
        src={upload.src} // Replace with your video source
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <div className={"absolute bottom-0 left-0 text-white flex-col p-2"}>
        <div>
          <span className={"text-xl font-bold"}>{upload.topTag}</span>{" "}
          <span className={"text-muted"}>+8</span>
        </div>
        <div>
          <span>{upload.uploaderName}, </span>
          <span className={"text-muted"}>
            {formatDistanceToNow(upload.uploadedAt, { addSuffix: true })}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 flex flex-col gap-1 z-10 text-white p-2">
        <div className={"my-4"}>
          <div className={"flex flex-col items-center justify-center"}>
            <PlusCircle size={33} />
            {upload.benis >= 1 && <span>{upload.benis}</span>}
          </div>
          <div className={"flex flex-col items-center justify-center"}>
            <MinusCircle size={33} />
            {upload.benis <= 0 && <span>{upload.benis}</span>}
          </div>
        </div>
        <div className={"flex flex-col items-center justify-center"}>
          <MessageSquareMore size={33} />
          <span>{upload.commentsCount}</span>
        </div>
      </div>

      {/* Optional Overlay */}
      {/*<div className="absolute inset-0 bg-black bg-opacity-50"></div>*/}
      {/* Foreground Video */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          className="w-full h-full max-w-full max-h-full object-contain"
          src={upload.src} // Replace with your video source
          autoPlay
          loop
          muted
          onClick={() => {
            // TODO: Pause video
          }}
          playsInline
        />
      </div>
    </>
  );
}
