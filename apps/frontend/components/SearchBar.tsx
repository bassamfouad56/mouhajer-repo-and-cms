"use client";
import React, { useEffect, useState } from "react";
import SearchIcon from "./SVG/SearchIcon";
import SerachIconLight from "./SVG/SerachIconLight";
import CancelIcon from "./SVG/CancelIcon";
import OutsideClickHandler from "react-outside-click-handler";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type Props = {
  isBlacked?: boolean;
};

const SearchBar = ({ isBlacked }: Props) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [text, setText] = useState(``);
  const [query] = useDebounce(text, 500);
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    if (!query) {
      router.push(`${pathName}`);
    } else {
      router.push(`/search?search=${query}`);
    }
  }, [router, query]);
  return (
    <OutsideClickHandler onOutsideClick={() => setShowSearchBar(false)}>
      <div>
        <div
          className="cursor-pointer hover:opacity-60 transition"
          onClick={() => setShowSearchBar(true)}
        >
          {isBlacked ? <SearchIcon /> : <SerachIconLight />}
        </div>
        <div
          className={`fixed w-screen  top-0 bg-white left-0 transition duration-1000 ${
            showSearchBar
              ? "translate-y-0 opacity-100"
              : "translate-y-[-100%] opacity-0"
          } `}
        >
          <div
            className="absolute right-20 top-20 cursor-pointer hover:opacity-60 transition"
            onClick={() => setShowSearchBar(false)}
          >
            <CancelIcon />
          </div>
          <div className="pl-40 pt-[9rem] pb-[6rem]">
            <div className="flex items-center    w-fit">
              <SearchIcon />
              <input
                onChange={(e) => setText(e.target.value)}
                autoFocus
                className="px-4 text-gray-600 outline-none text-lg w-[40rem]"
                placeholder="Search Here"
              />
            </div>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default SearchBar;
