"use client";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
type Props = {};

const SearchInputField = (props: Props) => {
  const [text, setText] = useState(``);
  const [query] = useDebounce(text, 500);
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    if (query) {
      router.push(pathName);
    } else {
      router.push(`${pathName}?seach=${query}`);
    }
  }, [router, query]);
  return (
    <div className="flex lg:items-center gap-6 w-full max-w-lg  ">
      <div className="flex flex-col w-full">
        <div className="flex  lg:items-center mb-4 lg:px-12 gap-6">
          <SearchIcon />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What are you looking for?"
            type="text"
            className=" w-full bg-transparent uppercasefont-Satoshi lg:px-4 outline-none text-gray-4 text-sm lg:text-lg"
          />
        </div>
        <div className="w-full h-0.5  opacity-[20%] bg-black"></div>
      </div>
    </div>
  );
};

export default SearchInputField;
