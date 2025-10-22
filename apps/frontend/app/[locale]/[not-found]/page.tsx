import ContactForm from "@/components/ContactForm";
import PAgeNotFoundBAnner from "@/components/PAgeNotFoundBAnner";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <PAgeNotFoundBAnner />
      <ContactForm />
    </div>
  );
};

export default page;
