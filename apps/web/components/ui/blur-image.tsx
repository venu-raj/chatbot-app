import { cn } from "@workspace/utils";
import Image, { ImageProps } from "next/image";
import { memo, useEffect, useState } from "react";

// Helps prevent flickering from re-rendering
export const BlurImage = memo((props: ImageProps) => {
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState(props.src);
  useEffect(() => setSrc(props.src), [props.src]); // update the `src` value when the `prop.src` value changes

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false);
    const target = e.target as HTMLImageElement;
    if (target.naturalWidth <= 16 && target.naturalHeight <= 16) {
      setSrc(`https://avatar.vercel.sh/${encodeURIComponent(props.alt)}`);
    }
  };

  return (
    <Image
      {...props}
      src={src}
      alt={props.alt}
      className={cn(
        loading ? "blur-[2px]" : "blur-0",
        props.className,
        "cursor-pointer object-cover"
      )}
      onLoad={handleLoad}
      onError={() => {
        setSrc(
          `https://images.unsplash.com/photo-1760697387026-fbd754bd7abe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764`
        );
      }}
      unoptimized
    />
  );
});
