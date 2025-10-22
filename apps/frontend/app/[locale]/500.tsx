import ContactForm from "@/components/ContactForm";
import PAgeNotFoundBAnner from "@/components/PAgeNotFoundBAnner";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="pt-52 z-0 bg-[#202020] overflow-hidden">
      <PAgeNotFoundBAnner />
      <ContactForm />
    </div>
  );
};

export default page;
