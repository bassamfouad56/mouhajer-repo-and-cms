import React from "react";

type Props = {};

const FilterToolbarSearchPage = (props: Props) => {
  return (
    <ul className="flex items-center mb-12">
      <li className="py-4 cursor-pointer hover:bg-opacity-60 transition px-6 text-white bg-[#363636]">
        All
      </li>
      <li className="py-4 cursor-pointer hover:bg-opacity-60 transition px-6 text-white bg-[#363636]">
        Our Projects
      </li>
      <li className="py-4 cursor-pointer hover:bg-opacity-60 transition px-6 text-white bg-[#363636]">
        Services
      </li>
      <li className="py-4 cursor-pointer hover:bg-opacity-60 transition px-6 text-white bg-[#363636]">
        Blog
      </li>
      <li className="py-4 cursor-pointer hover:bg-opacity-60 transition px-6 text-white bg-[#363636]">
        Careers
      </li>
    </ul>
  );
};

export default FilterToolbarSearchPage;
