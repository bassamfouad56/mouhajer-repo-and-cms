import BreadCrumbs from "@/components/BreadCrumbs";
import { contentArr } from "@/components/utils/PrivacyPolicyContent";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="pt-52">
      <div className="">
        <div className="flex justify-center flex-col items-center gap-12 mb-32">
          <BreadCrumbs />
          <h1 className="text-7xl font-SchnyderS uppercase">Privacy Policy</h1>
        </div>
        <div className="">
          <div className="container">
            {contentArr?.map((el, i) => (
              <div key={el.title + i} className="mb-32 font-Satoshi">
                <div className="text-4xl font-SchnyderS uppercase  flex items-center gap-1 mb-12">
                  <span>
                    {i + 1}
                    {". "}
                  </span>
                  <h4 className="">{el.title}</h4>
                </div>
                <ul className="text-start">
                  {el.description?.map((desc, deci) => (
                    <div
                      key={desc.content + deci}
                      className="pl-2 mb-10 space-y-4"
                    >
                      <li className="flex items-start gap-2 ">
                        <p>
                          {i + 1}.{deci + 1}
                        </p>
                        <p>{desc.content}</p>
                      </li>
                      <div className="pl-6">
                        {desc?.list?.map((listItem: any, listItemi: number) => (
                          <div key={listItem + listItemi} className="">
                            <li className="relative">
                              {listItem.type === "bullet" && <Bullets />}
                              {listItem.type === "latin" && (
                                <LatinPoints index={listItemi} />
                              )}

                              {listItem.content}
                            </li>
                            <ul className="pl-8">
                              {listItem.list?.map(
                                (innerChild: any, inneindex: number) => (
                                  <li
                                    key={innerChild + inneindex}
                                    className="relative flex items-start"
                                  >
                                    {innerChild?.type === "hollow" && (
                                      <HollowBullets />
                                    )}
                                    <p>{innerChild.content}</p>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

const Bullets = () => (
  <div className="absolute w-1.5 h-1.5 rounded-full bg-black left-0 translate-x-[-150%] translate-y-[-50%] top-[50%] " />
);

const LatinPoints = ({ index }: any) => {
  const letterIndex = index;
  const letter = String.fromCharCode(letterIndex + "a".charCodeAt(0));

  return (
    <div className="absolute  left-0 translate-x-[-150%] translate-y-[-50%] top-[50%]">
      {letter} {". "}
    </div>
  );
};

const HollowBullets = () => (
  <div className="absolute w-1.5 h-1.5 rounded-full bg-transparent border border-black left-0 translate-x-[-150%] translate-y-[-50%] top-[50%] " />
);
