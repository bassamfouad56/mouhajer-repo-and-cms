"use client";
import React, { useEffect, useRef } from "react";
import WhatsAppSVG from "./SVG/WhatsAppSVG";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

type Props = {
  whatsappTextImage?: string;
};

// CMS Images
const WHATSAPP_TEXT_IMAGE = "https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006894324-whatsapptext-BHZUJdi9GcCIxHfeUOR1lpOqmNSPHT.webp";

const WhatsappComp = ({ whatsappTextImage = WHATSAPP_TEXT_IMAGE }: Props) => {
  const textRef = useRef(null);
  gsap.registerPlugin(useGSAP);

  useEffect(() => {
    gsap.to(textRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 10,
      ease: "linear",
    });
  }, []);

  return (
    <a
      href="https://api.whatsapp.com/send/?phone=971523041482&text&type=phone_number&app_absent=0"
      target="_blank"
    >
      <div className="fixed left-0 bottom-16 md:left-16 z-[8] ">
        <div className="flex justify-center items-center">
          {/* <div className="w-24 h-24 relative animate-spin-slow  "></div> */}
          <div className=" top-[50%] left-[50%] translate-x-[-50%]  ">
            <div className="w-32 h-32  absolute flex justify-center items-center translate-y-[-50%]">
              <WhatsAppSVG />
              <Image
                className="w-full h-full object-contain absolute animate-spin-slow"
                src={whatsappTextImage}
                alt="WhatsApp Contact"
                width={128}
                height={128}
              />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default WhatsappComp;
