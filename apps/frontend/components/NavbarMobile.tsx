"use client";
import React, { useEffect, useState } from "react";
import LogoMobileLight from "./SVG/LogoMobileLight";
import LogoMobileDark from "./SVG/LogoMobileDark";
import SerachIconLight from "./SVG/SerachIconLight";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageState from "./LanguageState";
import { useLocale } from "next-intl";
import { NavItem as NavItemType } from "@/lib/navigation-fetcher";

type Props = {
  navigationItems?: NavItemType[];
};

const NavbarMobile = ({ navigationItems = [] }: Props) => {
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isBlacked =
    pathname === "/contact-us" ||
    pathname === "/services" ||
    pathname.startsWith("/blogs/") ||
    pathname.includes("who-we-are") ||
    (pathname.includes("our-projects/") &&
      !pathname.includes("Commercial") &&
      !pathname.includes("/services/"));
  return (
    <div
      className={`lg:hidden fixed w-full   z-[9] transition-all duration-1000 ${
        scrolled ? "backdrop-blur-xl bg-black bg-opacity-25" : ""
      }`}
    >
      <div className="p-4 ">
        <div className="flex justify-between">
          <Link href={"/"}>
            <>
              {!menuOpen ? (
                <>{!isBlacked ? <LogoMobileDark /> : <LogoMobileLight />}</>
              ) : (
                <LogoMobileDark />
              )}
            </>
          </Link>
          <div className="gap-4 flex items-center">
            <SerachIconLight />
            <div
              className={`text-white space-y-1 `}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div
                className={`w-full h-0.5                   ${
                  isBlacked ? "bg-black" : "bg-white"
                }
                `}
              ></div>
              <div className="relative flex overflow-hidden min-w-[4.5rem] min-h-[2rem]">
                <h4
                  className={`font-SchnyderS uppercase text-2xl absolute transition-all duration-1000 delay-300  
                  ${isBlacked ? "text-black" : "text-white"}
                  ${!menuOpen ? "translate-x-[0]" : "translate-x-[120%]"}`}
                >
                  Menu
                </h4>
                <h4
                  className={`font-SchnyderS uppercase text-2xl absolute transition-all duration-1000 delay-300 ${
                    menuOpen ? "translate-x-[0]" : "translate-x-[-120%]"
                  }`}
                >
                  {" "}
                  Close
                </h4>
              </div>
              <div
                className={`w-full h-0.5                   ${
                  isBlacked ? "bg-black" : "bg-white"
                }
`}
              ></div>{" "}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed w-screen h-screen bg-black z-[-1] top-0 transition-all duration-1000 ${
          menuOpen ? "translate-x-0" : "translate-x-[100%]"
        }`}
      >
        <div className="pl-5 flex flex-col font-SchnyderS text-3xl uppercase pt-40 text-gray-300 space-y-5 ">
          <div className="" onClick={() => setMenuOpen(false)}>
            <Link href={"/"}>
              <p>{locale === "en" ? "Home" : "الرئيسية"}</p>
            </Link>
          </div>
          {navigationItems.length > 0 ? (
            // Use CMS navigation items
            navigationItems.map((item) => (
              <div key={item.id} className="" onClick={() => setMenuOpen(false)}>
                <Link href={item.url || "#"}>
                  <p>{item.label[locale as "en" | "ar"]}</p>
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="pl-4 text-xl space-y-2 mt-2">
                    {item.children.map((child) => (
                      <div key={child.id} onClick={() => setMenuOpen(false)}>
                        <Link href={child.url || "#"}>
                          <p className="text-gray-400">{child.label[locale as "en" | "ar"]}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            // Fallback to hardcoded links
            <>
              <div className="" onClick={() => setMenuOpen(false)}>
                <Link href={"/who-we-are"}>
                  <p>{locale === "en" ? "Who we are" : "مَن نحن"}</p>
                </Link>
              </div>
              <div className="" onClick={() => setMenuOpen(false)}>
                <Link href={"/our-projects"}>
                  <p>{locale === "en" ? "Our Projects" : "محفظة الأعمال"}</p>
                </Link>
              </div>{" "}
              <div className="" onClick={() => setMenuOpen(false)}>
                <Link href={"/services"}>
                  <p>{locale === "en" ? "Services" : "خدمات"}</p>
                </Link>
              </div>{" "}
              <div className="" onClick={() => setMenuOpen(false)}>
                <Link href={"/blogs"}>
                  <p>{locale === "en" ? "Blogs" : "مقالات"}</p>
                </Link>
              </div>{" "}
              <div className="" onClick={() => setMenuOpen(false)}>
                <Link href={"/contact-us"}>
                  <p>{locale === "en" ? "Contact Us" : "تواصل معنا"}</p>{" "}
                </Link>
              </div>
            </>
          )}
          <LanguageState />
        </div>
      </div>
    </div>
  );
};

export default NavbarMobile;
