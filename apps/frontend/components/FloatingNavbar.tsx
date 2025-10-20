"use client";
import React, { useState, useEffect } from "react";
import LogoSvg from "./SVG/LogoSvg";
import Link from "next/link";
import { useLocale } from "next-intl";

const FloatingNavbar = () => {
  const local = useLocale();
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  useEffect(() => {
    let lastScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrollingUp(scrollTop < lastScrollTop && scrollTop > 0);
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 w-full bg-black text-white z-[9999] shadow-xl transition-transform duration-300 ${
        !isScrollingUp ? "translate-y-[-100%]" : "translate-y-0"
      }`}
    >
      <div className="px-16">
        <div className="py-4 2xl:py-12">
          <div
            className="flex justify-between items-center"
            dir={local === "en" ? "ltr" : "rtl"}
          >
            <Link href={"/"}>
              <LogoSvg />
            </Link>
            <div
              className={`flex items-center gap-12 text-white font-Satoshi ${
                local === "en" ? "text-base" : "text-2xl"
              }`}
            >
              <Link href="/who-we-are">
                {local === "en" ? "Who We Are" : "مَن نحن"}
              </Link>
              <Link href="/our-projects">
                {local === "en" ? "Our Projects" : "المشاريع"}
              </Link>
              <Link href="/services">
                {local === "en" ? "Services" : "خدماتنا"}
              </Link>
              <Link href="/blogs">{local === "en" ? `Blogs` : "مقالات"}</Link>
              <Link href="/contact-us">
                <button
                  className={` px-5 py-2 ${
                    !true ? "bg-black text-white" : "text-black bg-white"
                  } font-medium`}
                >
                  {local === "en" ? "Make an enquiry" : "إجراء استفسار"}
                </button>
              </Link>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingNavbar;
