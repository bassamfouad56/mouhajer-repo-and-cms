import { SearchIcon } from "lucide-react";
import React from "react";

type Props = {};

const SearchScreenInputSearchField = (props: Props) => {
  return (
    <div className="max-w-screen-2xl mb-32">
      <div className="w-full  flex gap-2 items-center">
        <SearchIcon className="mb-2 h-12 w-12 stroke-1" />
        <input
          autoFocus
          type=" text"
          className="bg-transparent w-full px-4 text-4xl font-SchnyderS outline-none"
          placeholder="What are you looking for?"
        />
      </div>
      <div className="w-full h-0.5 bg-black opacity-20 mt-4"></div>
    </div>
  );
};

export default SearchScreenInputSearchField;
