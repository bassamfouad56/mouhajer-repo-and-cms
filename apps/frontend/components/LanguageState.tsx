"use client";
import { ChevronDown, Globe } from "lucide-react";
import OutsideClickHandler from "react-outside-click-handler";
import { useRouter, usePathname } from "../navigation";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useState, useTransition } from "react";

const LanguageState = (props: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const localeLang = useLocale();
  const [isPending, startTransition] = useTransition();

  const [showLanguages, setShowLanguages] = useState(false);
  const [languageState, setLanguageState] = useState(
    localeLang === "en" ? 0 : 1
  );
  const arr = [
    { id: 0, title: "English", link: "en" },
    { id: 1, title: "عربى", link: "ar" },
    // { id: 2, title: "Russian" },
  ];
  const filteredArr = arr?.filter((item) => item.id !== languageState && item);
  function onSelectChange(event: any) {
    const nextLocale = event;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }
  return (
    <div className={`mr-12 flex items-center gap-2 relative`}>
      <Globe />
      <div
        className="flex items-center gap-1 min-w-[8rem] justify-between cursor-pointer relative z-[9]"
        onClick={() => setShowLanguages(!showLanguages)}
      >
        <p>{arr[languageState]?.title}</p>
        <ChevronDown />
      </div>
      <div
        className={`absolute text-black w-full   bg-white -bottom-1 shadow rounded-[5px] transition duration-1000 ${
          showLanguages
            ? "translate-y-[100%] opacity-100"
            : "translate-y-[-100%] opacity-0"
        }`}
      >
        <OutsideClickHandler onOutsideClick={() => setShowLanguages(false)}>
          <div className="flex flex-col text-sm">
            {filteredArr.map((el, i) => (
              // <Link key={i} href={`${el.link}`}>
              <p
                key={i}
                className="py-2 hover:bg-black hover:bg-opacity-20 pl-4 cursor-pointer"
                onClick={(e) => {
                  setLanguageState(el.id); // Update languageState with the id of the selected language
                  setShowLanguages(false);
                  onSelectChange(el.link);
                }}
              >
                {el.title}
              </p>
              // </Link>
            ))}
          </div>
        </OutsideClickHandler>
      </div>
    </div>
  );
};

export default LanguageState;
