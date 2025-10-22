"use client";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useTransition,
} from "react";
import PhoneInput from "react-phone-input-2";
import CheveronDown from "./SVG/CheveronDown";
import OutsideClickHandler from "react-outside-click-handler";
import { toast } from "sonner";
import { cmsClient } from "@/lib/cms-client";

type Props = {
  setSteps: Dispatch<SetStateAction<boolean>>;
  steps: boolean;
  locale: string;
};

const ContactFormForm = ({ setSteps, steps, locale }: Props) => {
  const [isPending, startTransition] = useTransition();

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [emailField, setEmailField] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [isIndividual, setIsIndividual] = useState(0);
  const [showServices, setShowServices] = useState(false);
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    if (firstName && isValidEmail(emailField) && phoneNumber) {
      return true;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      startTransition(async () => {
        try {
          // Submit lead to CMS for tracking and scoring
          const leadData: any = {
            name: firstName,
            email: emailField,
            phone: phoneNumber,
            source: 'website',
            locale: locale || 'en',
          };

          // Only include optional fields if they have values
          if (company) leadData.company = company;
          if (service) leadData.projectType = service;
          if (projectLocation) leadData.projectLocation = projectLocation;
          if (projectBudget) leadData.budget = projectBudget;
          if (startDate) leadData.timeline = startDate;
          if (projectDescription) leadData.message = projectDescription;

          const result = await cmsClient.submitLead(leadData);

          if (result.success) {
            // Show success message with lead score info
            if (result.duplicate) {
              toast.success(
                locale === "en"
                  ? "Thank you! We've updated your inquiry."
                  : "شكراً! تم تحديث استفسارك."
              );
            } else {
              toast.success(
                locale === "en"
                  ? "Thank you! We'll be in touch soon."
                  : "شكراً! سنتواصل معك قريباً."
              );
            }

            // Reset form
            setFirstName("");
            setEmailField("");
            setPhoneNumber("");
            setCompany("");
            setService("");
            setProjectLocation("");
            setProjectBudget("");
            setStartDate("");
            setProjectDescription("");
            setSteps(false);
          } else {
            toast.error(
              locale === "en"
                ? "Error submitting form. Please try again."
                : "خطأ في إرسال النموذج. يرجى المحاولة مرة أخرى."
            );
          }
        } catch (error) {
          console.error("Form submission error:", error);
          toast.error(
            locale === "en"
              ? "Error submitting form. Please try again later."
              : "خطأ في إرسال النموذج. يرجى المحاولة مرة أخرى لاحقاً."
          );
        }
      });
    } else {
      setSteps(false);
      setShowErrorMessage(true);
    }
  };

  return (
    <form className="relative h-full" onSubmit={handleFormSubmit}>
      <div
        className={`space-y-5 transition-all ${
          !steps ? "translate-x-0" : "translate-x-[-100%]"
        }`}
      >
        <input
          className="w-full bg-transparent border border-[#202020] py-5 px-4 border-opacity-[20%] placeholder:text-black font-Satoshi font-light"
          placeholder={locale === "en" ? "First Name *" : "الاسم الأول *"}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <div className="">
          <div className="flex flex-col gap-1">
            <p
              className={`text-xs text-red-500 transition ${
                showErrorMessage && !isValidEmail(emailField)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[100%] opacity-0"
              }`}
            >
              {locale === "en"
                ? "Email Is not Valid"
                : "البريد الإلكتروني غير صحيح"}
            </p>
            <input
              className="w-full bg-transparent border border-[#202020] py-5 px-4 border-opacity-[20%] placeholder:text-black font-Satoshi font-light"
              placeholder={locale === "en" ? "Email *" : "البريد"}
              value={emailField}
              onChange={(e) => setEmailField(e.target.value)}
              onBlur={() => {
                setShowErrorMessage(!isValidEmail(emailField));
              }}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="gap-3 flex items-center py-4 px-5 relative border border-[#202020] border-opacity-[20%] placeholder:text-black font-Satoshi font-light w-full">
            <PhoneInput
              country={"ae"}
              containerStyle={{ width: "auto" }}
              inputStyle={{
                width: "fit-content",
                background: "transparent",
                border: "none",
              }}
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
            <CheveronDown />
          </div>
          <div className="h-full grow border w-full">
            <input
              className="w-full bg-transparent border border-[#202020] py-5 px-4 border-opacity-[20%] placeholder:text-black font-Satoshi font-light"
              placeholder={locale === "en" ? "Phone Number *" : "رقم الهاتف *"}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full bg-transparent border-[#202020] py-5 px-4 border-opacity-[20%] text-black font-Satoshi font-light flex justify-between items-center"></div>
        <div className="grid 2xl:grid-cols-2 gap-5">
          <div
            className="py-5 px-4 border-[#202020] flex items-center justify-between col-span-1 font-Satoshi font-light border border-opacity-[20%]"
            onClick={() => setIsIndividual(0)}
          >
            <p className="">{locale === "en" ? "Individuals" : "الأفراد"}</p>
            <div
              className={`border w-5 h-5 rounded-full border-[#202020] border-opacity-[20%] ${
                isIndividual === 0 && "bg-black"
              } `}
            ></div>
          </div>
          <div
            className="py-5 px-4 border-[#202020] flex items-center justify-between col-span-1 font-Satoshi font-light border border-opacity-[20%]"
            onClick={() => setIsIndividual(1)}
          >
            <p className="">{locale === "en" ? "Company" : "شركة"}</p>
            <div
              className={`border w-5 h-5 rounded-full border-[#202020] border-opacity-[20%] ${
                isIndividual === 1 && "bg-black"
              } `}
            ></div>
          </div>
        </div>
        <input
          className="w-full bg-transparent border border-[#202020] py-5 px-4 border-opacity-[20%] placeholder:text-black font-Satoshi font-light"
          placeholder={locale === "en" ? "Company" : "شركة"}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <div className="relative">
          <div
            onClick={() => setShowServices(true)}
            className="relative w-full bg-transparent border border-[#202020] py-5 px-4 border-opacity-[20%] text-black font-Satoshi font-light flex justify-between items-center"
          >
            {service ? (
              <p>{service}</p>
            ) : (
              <p>
                {locale === "en"
                  ? "Service you are looking for"
                  : "الخدمة التي تبحث عنها"}
              </p>
            )}

            <CheveronDown />
          </div>
          {showServices && (
            <OutsideClickHandler onOutsideClick={() => setShowServices(false)}>
              <div className="bg-white  shadow uppercase">
                <p
                  onClick={() => {
                    setShowServices(false);
                    setService("Hotels");
                  }}
                  className="py-2 cursor-pointer px-4 hover:bg-gray-100"
                >
                  Hotels
                </p>
                <p
                  onClick={() => {
                    setShowServices(false);
                    setService("RESIDENTIAL");
                  }}
                  className="py-2 cursor-pointer px-4 hover:bg-gray-100"
                >
                  RESIDENTIAL
                </p>
                <p
                  onClick={() => {
                    setShowServices(false);
                    setService("commercial");
                  }}
                  className="py-2 cursor-pointer px-4 hover:bg-gray-100"
                >
                  commercial
                </p>
                <p
                  onClick={() => {
                    setShowServices(false);
                    setService("restaurant");
                  }}
                  className="py-2 cursor-pointer px-4 hover:bg-gray-100"
                >
                  restaurant
                </p>
                <p
                  onClick={() => {
                    setShowServices(false);
                    setService("other");
                  }}
                  className="py-2 cursor-pointer px-4 hover:bg-gray-100"
                >
                  Other
                </p>
              </div>
            </OutsideClickHandler>
          )}
        </div>
      </div>
      <div
        className={`space-y-5 transition-all absolute bottom-0 translate-y-[-50%] w-full ${
          steps ? "translate-x-0 translate-y-[-90%]" : "translate-x-[-100%]"
        }`}
      >
        <div className="space-y-5 w-full">
          <div className="w-full bg-transparent border border-[#202020] py-5 px-4 border-opacity-[20%] text-black font-Satoshi font-light flex justify-between items-center">
            <p>Project Location</p>
            <CheveronDown />
          </div>
          <input
            className="w-full bg-transparent border border-[#202020] py-5 px-4 border-opacity-[20%] placeholder:text-black font-Satoshi font-light"
            placeholder="Project Budget"
            value={projectBudget}
            onChange={(e) => setProjectBudget(e.target.value)}
          />
          <input
            type="date"
            className="w-full bg-transparent border border-[#202020] py-5 px-4 border-opacity-[20%] placeholder:text-black font-Satoshi font-light"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <textarea
            className="w-full min-h-[8rem] bg-transparent border border-[#202020] py-5 px-4 border-opacity-[20%] placeholder:text-black font-Satoshi font-light"
            placeholder="Project Description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          ></textarea>
        </div>
      </div>
      {!steps && (
        <button
          onClick={() => {
            setSteps(true);
          }}
          className="bg-[#202020] text-white flex items-center justify-center w-full py-5 font-Satoshi text-base mt-5"
        >
          {locale === "en" ? "Next" : "التالي"}
        </button>
      )}
      {steps && (
        <div className="mt-5 space-y-5 translate-y-[-100%]">
          <button
            onClick={() => {
              setSteps(false);
            }}
            className="bg-transparent text-black border border-black flex items-center justify-center w-full py-5 font-Satoshi text-base"
          >
            {locale === "en" ? "Previous" : "السابق"}
          </button>
          <button
            type="submit"
            className="bg-[#202020] text-white flex items-center justify-center w-full py-5 font-Satoshi text-base"
          >
            {locale === "en"
              ? isPending
                ? "Submitting..."
                : "submit"
              : isPending
              ? "جارٍ الإرسال"
              : "إرسال"}
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactFormForm;
