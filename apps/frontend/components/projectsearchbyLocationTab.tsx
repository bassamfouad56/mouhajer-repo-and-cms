"use client";
import React, { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";

type Props = {
  locations: string[];
};

const ProjectsearchbyLocationTab = ({ locations }: Props) => {
  const [showLoactions, setShowLocations] = useState(false);
  return (
    <div className="relative">
      <div
        className={`w-[120%] p-2 bg-[#202020] absolute top-0  shadow transition-all ${
          showLoactions
            ? "translate-y-[-100%] opacity-100 z-10"
            : "translate-y-[-80%] opacity-0 z-[0]"
        }`}
      >
        {locations?.map((location) => (
          <p key={location}>{location}</p>
        ))}
      </div>
      <OutsideClickHandler onOutsideClick={() => setShowLocations(false)}>
        <p
          onClick={() => setShowLocations(true)}
          className="text-white cursor-pointer hover:opacity-80 relative z-[999]"
        >
          Location : Dubai
        </p>
      </OutsideClickHandler>
    </div>
  );
};

export default ProjectsearchbyLocationTab;
