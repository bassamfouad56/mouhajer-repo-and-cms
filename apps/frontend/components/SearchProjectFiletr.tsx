"use client";
import { SearchIcon, XCircle } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import OutsideClickHandler from "react-outside-click-handler";

type Props = {
  showSerachInput: boolean;
  setSHowSearchInput: Dispatch<SetStateAction<boolean>>;
};

const SearchProjectFiletr = ({
  showSerachInput,
  setSHowSearchInput,
}: Props) => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [query] = useDebounce(text, 500);
  useEffect(() => {
    if (!query) {
      router.push(`/our-projects`);
    } else {
      router.push(`/our-projects?search=${query}`);
    }
  }, [query, router]);
  return (
    <OutsideClickHandler onOutsideClick={() => setSHowSearchInput(false)}>
      <>
        <div
          onClick={() => setSHowSearchInput(true)}
          className={`  p-2 rounded-full bg-white text-black justify-start cursor-pointer w-full ${
            showSerachInput ? "hidden" : "flex z-[999]"
          }`}
        >
          <SearchIcon />
        </div>
        <div
          className={`  p-2 rounded-full bg-white text-black justify-start absolute right-0 transition-transform  duration-1000  items-center px-4 gap-4  ${
            showSerachInput ? "flex w-full z-[999]" : "hidden"
          }`}
        >
          <SearchIcon />
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`border-0 ${showSerachInput ? "" : "hidden"}`}
            placeholder="Search For Project..."
          />
          <XCircle
            onClick={() => setSHowSearchInput(false)}
            className={`border-0 cursor-pointer ${
              showSerachInput ? "" : "hidden"
            }`}
          />
        </div>
      </>
    </OutsideClickHandler>
  );
};

export default SearchProjectFiletr;
