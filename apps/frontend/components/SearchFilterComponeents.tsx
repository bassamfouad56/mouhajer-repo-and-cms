"use client";
import React, { useState } from "react";
import CheveronDown from "./SVG/CheveronDown";
import OutsideClickHandler from "react-outside-click-handler";

type Props = {};

const SearchFilterComponeents = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const arr = [
    {
      id: 0,
      title: "Newest First",
    },
    {
      id: 0,
      title: "Oldest First",
    },
    {
      id: 0,
      title: "A-Z",
    },
    {
      id: 0,
      title: "Z-A",
    },
  ];
  return (
    <div className=" flex flex-col lg:items-center relative">
      <div
        className="flex items-center gap-4 lg:px-4 mb-4 cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <p className="text-black opacity-20 text-lg">Sort By</p>
        <div className="flex items-center gap-8">
          <p>Newest First</p>
          <CheveronDown />
        </div>
      </div>

      <div className="w-full h-0.5  opacity-[20%] bg-black"></div>
      {isOpen && (
        <div className="absolute w-full top-12">
          <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
            <div className="flex flex-col  ">
              {arr?.map((el) => (
                <div
                  key={el.title + el.id}
                  className="bg-[#F2F1E5] px-4 transition-all cursor-pointer hover:bg-opacity-40 "
                >
                  <p className="py-4 hover:bg-opacity-50">{el.title}</p>
                </div>
              ))}
            </div>
          </OutsideClickHandler>
        </div>
      )}
    </div>
  );
};

export default SearchFilterComponeents;
