import { useLocale } from "next-intl";
import StarSVG from "./SVG/StarSVG";
import Link from "next/link";

type Props = {
  title?: string;
  subtitle?: string;
  button?: string;
  textwhite?: boolean;
  about_arabic?: string;
  description_arabic?: string;
  contact?: boolean;
};

const AboutDescription = ({
  title,
  subtitle,
  button,
  textwhite,
  about_arabic,
  description_arabic,
  contact,
}: Props) => {
  const local = useLocale();
  return (
    <div
      className={`pb-[3rem] lg:pt-12 2xl:pb-[10rem] mt-5 2xl:mt-0 ${
        textwhite && "text-white"
      }`}
    >
      <div className="px-5 lg:px-24 2xl:px-96 ">
        <div className="grid lg:grid-cols-12">
          <h4 className="font-SchnyderS text-2xl lg:text-6xl font-light col-span-6 max-w-4xl mb-4">
            {local === "en" ? title : about_arabic}
          </h4>
          <div className="col-span-1"></div>
          <div className="col-span-5 clear-start font-Satoshi 2xl:text-lg font-normal">
            <p className="">{local === "en" ? subtitle : description_arabic}</p>
            {button && (
              <Link href={`/contact-us`}>
                <div className="flex items-center gap-4 mt-12 cursor-pointer group">
                  <div className="group-hover:rotate-90 transition-transform duration-1000">
                    <StarSVG />
                  </div>
                  <p className="uppercase font-Satoshi text-xl">
                    {local === "en" ? button : "تواصل معنا"}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDescription;
