import AboutBanner from "@/components/AboutBanner";
import WhatWeDoAboutPage from "@/components/WhatWeDoAboutPage";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  const res = await fetch(
    `http://mouhajer-dashboard.local//wp-json/wp/v2/services?acf_format=standard`,
    {
      method: "GET",
      cache: "no-cache",
    }
  ).catch(() => redirect("/"));
  const services = await res.json();
  return (
    <div className="pt-24 lg:pt-52 bg-[#fffef5]">
      <AboutBanner hideScroll />
      <WhatWeDoAboutPage hideTitle arr={services} />
    </div>
  );
};

export default page;
