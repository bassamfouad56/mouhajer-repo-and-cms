"use client";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useLocale } from "next-intl";
import ContactFormForm from "./ContactFormForm";

interface EnquiryFormProps {
  locale?: 'en' | 'ar';
}

const EnquiryForm = ({ locale: localeProp }: EnquiryFormProps) => {
  const localeFromContext = useLocale() as 'en' | 'ar';
  const locale = localeProp || localeFromContext;
  const [steps, setSteps] = useState(false);

  return (
    <div className="bg-[#F2F1E5] z-[9] relative">
      <div className="py-[6rem] 2xl:py-[16rem] ">
        <div className="px-4 lg:px-56 2xl:px-80">
          <div
            className={`grid lg:grid-cols-2  ${
              !steps && "gap-32"
            }  2xl:gap-80 h-full transition-all`}
          >
            <div className="max-w-[50rem] h-full">
              <div className="flex flex-col justify-between h-full">
                <div className="" dir={locale === "en" ? "ltr" : "rtl"}>
                  <p
                    className={`mb-5 font-Satoshi text-base text-black uppercase font-normal ${
                      locale === "en" ? "" : "text-right lg:text-5xl"
                    }`}
                  >
                    {locale === "en"
                      ? "Arrange an Appointment"
                      : "احجز موعداً معنا"}
                  </p>
                  <h4
                    className={`leading-relaxed 2xl:leading-[110%] text-5xl  font-light uppercase test-[#202020] font-SchnyderS ${
                      locale === "en" ? "lg:text-6xl" : "text-right lg:text-4xl"
                    }`}
                  >
                    {locale === "en"
                      ? "High-end interiors in the middle east"
                      : "تعرّف على أسلوبنا المميّز ورؤيتنا المفعمة بالإبداع في تغيير تصميم مساحاتك الخاصة. حدّد موعداً أو تفضل بزيارة مكتبنا في دبي، لنبدأ معاً رحلة أحلامك في الحصول على أفضل وأجود خدمات التصميم الداخلي و التشطيبات ."}
                  </h4>
                </div>
                <div className="flex w-[14rem] flex-col relative gap-4">
                  <div className="flex items-center justify-between font-Satoshi text-base">
                    <span>01</span>
                    <span>02</span>
                  </div>
                  <div className=" w-full h-1 bg-gray-300 bottom-0 rounded-full relative">
                    <div
                      className={`absolute w-[50%] h-full top-0 bg-black transition  ${
                        !steps ? "translate-x-0" : "translate-x-[100%]"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-full transition  overflow-hidden  ">
              <ContactFormForm
                steps={steps}
                setSteps={setSteps}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryForm;
