"use client";
import React, { useEffect, useRef } from "react";
import AIRoomDesignSVG from "./SVG/AIRoomDesignSVG";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
  aiTextImage?: string;
};

// CMS Images - Using local SVG by default, can be replaced with uploaded image from CMS
const AI_TEXT_IMAGE = "/ai-room-redesign-text.svg";

const AIRoomDesignComp = ({ aiTextImage = AI_TEXT_IMAGE }: Props) => {
  const textRef = useRef(null);
  const params = useParams();
  const locale = params.locale || 'en';

  gsap.registerPlugin(useGSAP);

  useEffect(() => {
    // Rotate the circular text continuously
    gsap.to(textRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 10,
      ease: "linear",
    });
  }, []);

  // Construct the link with proper locale
  const roomRedesignUrl = `/${locale}/room-redesign`;

  return (
    <a
      href={roomRedesignUrl}
      className="group"
      aria-label="AI Room Redesign - Transform your space with AI"
    >
      <div className="fixed left-0 bottom-16 md:left-16 z-[8] transition-transform hover:scale-110 duration-300">
        <div className="flex justify-center items-center">
          <div className="top-[50%] left-[50%] translate-x-[-50%]">
            <div className="w-32 h-32 absolute flex justify-center items-center translate-y-[-50%] relative">
              {/* Main AI Icon */}
              <AIRoomDesignSVG />

              {/* Rotating text around the icon */}
              <Image
                ref={textRef}
                className="w-full h-full object-contain absolute"
                src={aiTextImage}
                alt="AI Room Redesign - Transform Your Space"
                width={128}
                height={128}
              />

              {/* Pulsing glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            </div>

            {/* Tooltip on hover */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-xl whitespace-nowrap">
                <div className="font-semibold text-sm">✨ AI Room Redesign</div>
                <div className="text-xs opacity-90">Transform your space instantly</div>
              </div>
              {/* Arrow */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default AIRoomDesignComp;
