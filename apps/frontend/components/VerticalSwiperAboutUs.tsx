"use client";
import React from "react";
import VerticalSwiprCard from "./VerticalSwiprCard";
import { Service } from "@/lib/cms-types";

type Props = {
  id?: number;
  arr: Service[];
};

const VerticalSwiperAboutUs = ({ arr, id }: Props) => {
  return (
    <>
      {arr.map((service, index) => (
        <div key={service.id + index} className="pt-0 relative">
          <VerticalSwiprCard
            service={service}
            slug={service.id}
            index={index % 2 !== 0}
          />
        </div>
      ))}
    </>
  );
};

export default VerticalSwiperAboutUs;
