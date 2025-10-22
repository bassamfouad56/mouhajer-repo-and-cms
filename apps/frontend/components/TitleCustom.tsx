import React, { Dispatch, SetStateAction } from "react";

export default function TitleCustom({
  title,
  index,
  setRotation,
  setIndex,
}: {
  title: string;
  index: number;
  setRotation: (itemIndex: number) => void;
  setIndex: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div
      className="title-item"
      onMouseEnter={() => setRotation(index)}
      onMouseLeave={() => setIndex(-1)}
    >
      <h1 className="font-SchnyderS py-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        {title}
      </h1>
    </div>
  );
}
