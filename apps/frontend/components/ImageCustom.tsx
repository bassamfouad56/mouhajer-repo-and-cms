import React from "react";
import Image from "next/image";
import cn from "classnames";

export default function ImageCustom({
  url,
  active,
  rotationPosition,
  alt = "Mouhajer Interior Design",
  width = 400,
  height = 300,
}: {
  url: string;
  active: boolean;
  rotationPosition: number;
  alt?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "transition-transform duration-300 ease-in-out",
        { active }
      )}
      style={{
        transform: active
          ? `scale(1.1) rotate(${rotationPosition}deg)`
          : `rotate(${rotationPosition}deg)`,
      }}
      loading="lazy"
      quality={85}
    />
  );
}
