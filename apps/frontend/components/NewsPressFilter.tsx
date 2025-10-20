"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarSVG from "./SVG/StarSVG";

const NewsPressFilter = () => {
  const [isNews, setIsNews] = useState(false);

  return (
    <div className="max-w-2xl mx-auto uppercase mb-12 lg:mb-0">
      <div className="flex justify-between w-full font-Satoshi flex-col lg:px-0 translate-x-[10%] lg:translate-x-0 gap-6 lg:gap-0 lg:flex-row">
        <div
          className="flex items-center text-3xl font-Satoshi uppercase group relative"
          onClick={() => setIsNews(true)}
        >
          <AnimatePresence>
            {isNews && (
              <motion.div
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute left-0 top-0 translate-x-[-100%] translate-y-[-50%]">
                  <StarSVG />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <p
            className={`${
              !isNews && "opacity-20 group-hover:opacity-100 transition"
            }  ${isNews && "opacity-100"} cursor-pointer`}
          >
            News{" "}
          </p>
        </div>
        <div
          className="flex items-center text-3xl font-Satoshi uppercase group min-w-[5rem]"
          onClick={() => setIsNews(false)}
        >
          <AnimatePresence>
            {!isNews && (
              <motion.div
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute left-0 top-0 translate-x-[-100%] translate-y-[-50%]">
                  <StarSVG />
                </div>{" "}
              </motion.div>
            )}
          </AnimatePresence>
          <p
            className={`${
              isNews && "opacity-20 group-hover:opacity-100 transition"
            }  ${!isNews && "opacity-100"} cursor-pointer`}
          >
            in the press{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsPressFilter;
