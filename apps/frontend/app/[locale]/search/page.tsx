import BreadCrumbs from "@/components/BreadCrumbs";
import FeaturedBlogsHomepage from "@/components/FeaturedBlogsHomepage";
import FilterToolbarSearchPage from "@/components/FilterToolbarSearchPage";
import SearchCards from "@/components/SearchCards";
import SearchScreenInputSearchField from "@/components/SearchScreenInputSearchField";
import React from "react";

type Props = {
  searchParams: { search: string };
};

const page = async (props: Props) => {
  const res = await fetch(
    `http://mouhajer-dashboard.local//wp-json/wp/v2/blogs?acf_format=standard`,
    {
      cache: "no-cache",
      method: "GET",
    }
  );
  const allServicesRes = await fetch(
    `http://mouhajer-dashboard.local//wp-json/wp/v2/services?acf_format&per_page=100`,
    {
      method: "GET",
    }
  );
  const blogs = await res.json();
  const services = await allServicesRes.json();
  const filteredData = services?.filter(
    (el: any) =>
      (el.acf?.title.includes(props.searchParams.search) ||
        el.acf?.sub_title.includes(props.searchParams.search)) &&
      el
  );
  return (
    <div className="py-52 bg-[#FFFEF5]">
      <div className="flex justify-center w-full mb-32">
        <BreadCrumbs />
      </div>
      <div className="px-96">
        <SearchScreenInputSearchField />
        <FilterToolbarSearchPage />
        <p className="opacity-60 mb-12">3 RESULTS FOUND FOR “ AFFORD ”</p>
        <SearchCards arr={filteredData} />
        <div className="mt-28 mb-40 flex justify-center flexc">
          <p className="text-3xl uppercase font-SchnyderS">
            YOU MIGHT ALSO BE INTERESTED IN
          </p>
        </div>
      </div>
      <div className=" ">
        <FeaturedBlogsHomepage blogs={blogs} />
      </div>
    </div>
  );
};

export default page;
