import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

interface PressArticle {
  id: string;
  publication: string;
  logo: string;
  link?: string;
  alt?: string;
}

type Props = {
  articles?: PressArticle[];
  title?: string;
};

const PressArticles = ({ articles = [], title }: Props) => {
  const local = useLocale();

  const defaultTitle = local === "en"
    ? "PRESS ARTICLES ABOUT US"
    : "شعارات الصحف والمؤسسات الإعلامية";

  return (
    <div>
      <div className="py-[6rem] 2xl:py-[12rem]">
        <h4 className="font-SchnyderS uppercase text-4xl text-center 2xl:text-6xl lg:mb-6 2xl:mb-[6.5rem] max-w-lg mx-auto leading-snug">
          {title || defaultTitle}
        </h4>
        <div className="2xl:px-80">
          <div className="grid sm:grid-cols-3 lg:grid-cols-4 lg:gap-20">
            {articles?.map((article, i) => (
              <div key={article.id || i} className="w-full h-[12rem] relative">
                {article.link ? (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute w-full h-full"
                  >
                    <Image
                      className="absolute w-full h-full object-contain"
                      alt={article.alt || article.publication}
                      src={article.logo}
                      fill
                    />
                  </a>
                ) : (
                  <Image
                    className="absolute w-full h-full object-contain"
                    alt={article.alt || article.publication}
                    src={article.logo}
                    fill
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressArticles;
