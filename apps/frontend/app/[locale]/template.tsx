"use client";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import Loading from "@/components/Loading";

type Props = {
  children?: any;
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{
        background: "black",
        opacity: 0,
      }}
      animate={{ opacity: 1, background: "white" }}
      className=""
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </motion.div>
  );
}
