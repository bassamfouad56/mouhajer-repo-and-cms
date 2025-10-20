"use client";
import { PLACEHOLDER_IMAGE } from "@/lib/image-utils";
import LogoSvg from "./SVG/LogoSvg";
import TelephoneSvg from "./SVG/TelephoneSVG";

import NavbarItem from "./NavbarItem";
import { useParams, usePathname } from "next/navigation";
import DarkLogo from "./SVG/DarkLogo";
import Link from "next/link";
import TelephoneDarkSVG from "./SVG/TelephoneDarkSVG";
import LanguageState from "./LanguageState";
import SearchBar from "./SearchBar";
import { useLocale } from "next-intl";
import { BlogPost, Service, Project } from "@/lib/cms-types";
import { NavItem as NavItemType } from "@/lib/navigation-fetcher";

type Props = {
  services?: Service[];
  blogs?: BlogPost[];
  projectsData?: Project[];
  navigationItems?: NavItemType[];
};

const Navbar = ({ blogs, services, projectsData, navigationItems = [] }: Props) => {
  const langLocal = useLocale() as 'en' | 'ar';
  const params = useParams();
  const { locale } = params;
  const pathname = usePathname();
  const isBlacked =
    pathname === `/${locale}/services` ||
    pathname === `/${locale}/suppliers` ||
    pathname === `/${locale}/privacy-policy` ||
    pathname === `/${locale}/search` ||
    pathname === `/${locale}/design-services` ||
    pathname === `/${locale}/contact-us` ||
    pathname === "/privacy-policy" ||
    pathname === `/${locale}/careers` ||
    pathname === `/${locale}/blogs` ||
    pathname.startsWith(`/${locale}/blogs/`) ||
    pathname.includes("who-we-are") ||
    (pathname.includes("our-projects/") &&
      !pathname.includes("Commercial") &&
      !pathname.includes("/services/"));

  // Use CMS navigation if available, otherwise fall back to hardcoded
  const arr = navigationItems.length > 0
    ? navigationItems.map((item) => ({
        id: item.id,
        title: item.label[langLocal],
        link: item.url || "#",
        megamenu: item.type === "mega_menu" || item.type === "dropdown",
        arr: item.children?.map((child) => ({
          id: child.id,
          title: child.label[langLocal],
          link: child.url || "#",
          img: child.icon || PLACEHOLDER_IMAGE,
        })),
      }))
    : langLocal === "en"
      ? [
          {
            id: 0,
            title: "Who we are",
            link: `/who-we-are`,
          },
          {
            id: 3,
            title: "Services",
            megamenu: true,
            link: "/services",
            arr: services?.map((service) => ({
              id: service.id,
              title: service.title.en,
              img: service.icon || PLACEHOLDER_IMAGE,
            })),
          },
          {
            id: 3,
            title: "Our Projects",
            megamenu: true,
            link: "/our-projects",
            arr: projectsData?.map((project) => ({
              id: project.id,
              title: project.title.en,
              img: project.images?.[0] || PLACEHOLDER_IMAGE,
            })),
          },
          {
            id: 0,
            title: "Blog",
            link: "/blogs",
            arr: blogs?.map((blog) => ({
              id: blog.id,
              title: blog.title.en,
              img: blog.featuredImage || PLACEHOLDER_IMAGE,
            })),
          },
          {
            id: 0,
            link: "contact-us",
            title: "Contact US",
          },
        ]
      : [
          {
            id: 0,
            title: "مَن نحن",
            link: `/who-we-are`,
          },
          {
            id: 3,
            title: "خدماتنا",
            megamenu: true,
            link: "/services",
            arr: services?.map((service) => ({
              id: service.id,
              title: service.title.ar,
              img: service.icon || PLACEHOLDER_IMAGE,
            })),
          },
          {
            id: 3,
            title: "المشاريع",
            megamenu: true,
            link: "/our-projects",
            arr: projectsData?.map((project) => ({
              id: project.id,
              title: project.title.ar,
              img: project.images?.[0] || PLACEHOLDER_IMAGE,
            })),
          },
          {
            id: 0,
            title: "مقالات",
            link: "/blogs",
            arr: blogs?.map((blog) => ({
              id: blog.id,
              title: blog.title.ar,
              img: blog.featuredImage || PLACEHOLDER_IMAGE,
            })),
          },
          {
            id: 0,
            link: "contact-us",
            title: "تواصل معنا",
          },
        ];

  return (
    <div
      className={`absolute w-full z-[2] border border-opacity-15 transition duration-1000   bg-opacity-40 ${
        isBlacked ? "border-black text-black" : "border-white text-white"
      }`}
    >
      <div className=" px-16 mx-auto">
        <div className="flex justify-between">
          <div
            className={`flex items-center  border-r  border-opacity-15 ${
              isBlacked ? "border-black" : "border-white"
            } pr-12`}
          >
            <Link href="/">
              <div className="pt-[55px] pb-[27px]">
                {isBlacked ? <DarkLogo /> : <LogoSvg />}
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-end gap-10 pt-[55px] pb-[27px] ">
            <div
              className="flex items-center relative z-[9]  "
              dir={locale === "en" ? "ltr" : "rtl"}
            >
              {/* HERE */}
              <LanguageState />
              <div className="flex items-center gap-2 mr-10">
                {isBlacked ? <TelephoneDarkSVG /> : <TelephoneSvg />}
                <p>+97144318426</p>
              </div>
              <div className="mx-4">
                {/* Here */}
                <SearchBar isBlacked={isBlacked} />
              </div>
              <Link href="/contact-us">
                <button
                  className={` px-5 py-2 ${
                    isBlacked ? "bg-black text-white" : "text-black bg-white"
                  } font-medium`}
                >
                  {langLocal === "en" ? "Make an enquiry" : "إجراء استفسار"}
                </button>
              </Link>
            </div>
            <div
              className="flex items-center gap-10"
              dir={locale === "en" ? "ltr" : "rtl"}
            >
              {arr.map((el, i) => (
                <NavbarItem
                  link={el.link}
                  key={el.title + i}
                  text={el.title}
                  {...(el.megamenu !== undefined && { megamenu: el.megamenu })}
                  isBlacked={isBlacked}
                  {...(el.arr !== undefined && { arr: el.arr })}
                />
              ))}
              <Link href="/suppliers">
                <button
                  className={` px-5 py-2 ${
                    isBlacked ? "bg-black text-white" : "text-black bg-white"
                  } font-medium`}
                >
                  {langLocal === "en" ? "For Suppliers" : "للموردين"}
                </button>
              </Link>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
