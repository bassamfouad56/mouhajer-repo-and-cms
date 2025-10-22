"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { useLocale } from "next-intl";
import { cmsClient } from "@/lib/cms-client";
type Props = {};

const SupplierForm = (props: Props) => {
  const [isPending, startTransition] = useTransition();
  const formSchema = z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(50),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .max(50),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits"),
    companyEmail: z.string().email("Invalid email address"),
    companyName: z
      .string()
      .min(2, "Company name must be at least 2 characters long")
      .max(100),
    attachments: z.any().optional(),
    message: z
      .string()
      .min(10, "Message must be at least 10 characters long")
      .max(1000, "Message must be at most 1000 characters long")
      .optional(), // Optional if the message field is not required
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      companyEmail: "",
      companyName: "",
      attachments: null,
      message: "", // Add message to defaultValues
    },
  });

  const onSubmit = async (values: any) => {
    startTransition(async () => {
      try {
        // Submit supplier/partner inquiry to CMS
        const leadData: any = {
          name: `${values.firstName} ${values.lastName}`,
          email: values.companyEmail,
          phone: values.phoneNumber,
          company: values.companyName,
          projectType: 'Supplier/Partner Inquiry',
          source: 'supplier-form',
          locale: locale || 'en',
        };

        // Only include message if it has a value
        if (values.message) {
          leadData.message = values.message;
        }

        const result = await cmsClient.submitLead(leadData);

        if (result.success) {
          toast.success(
            locale === "en"
              ? "Thank you! We've received your inquiry and will be in touch soon."
              : "شكراً! تم استلام استفسارك وسنتواصل معك قريباً."
          );

          // Reset form
          form.reset();
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
  };
  const locale = useLocale();
  const [steps, setSteps] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [emailField, setEmailField] = useState("");
  return (
    <div className="bg-[#F2F1E5]">
      <div className="py-[6rem] 2xl:py-[16rem] ">
        <div className="px-4 lg:px-56 2xl:px-80">
          <div
            className={`grid lg:grid-cols-2  ${
              !steps && "gap-32"
            }  2xl:gap-80 h-full transition-all`}
          >
            <div className="max-w-[50rem] h-full">
              <div className="flex flex-col justify-between h-full">
                <div className="">
                  <p
                    className={`mb-5 font-Satoshi text-base text-black uppercase font-normal ${
                      locale === "en" ? "" : "text-right"
                    }`}
                  >
                    {locale === "en"
                      ? "Arrange an Appointment"
                      : "احجز موعداً معنا"}
                  </p>
                  <h4
                    className={`leading-relaxed 2xl:leading-[110%] text-5xl lg:text-6xl font-light uppercase test-[#202020] font-SchnyderS ${
                      locale === "en" ? "" : "text-right"
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attachments</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            multiple={false} //Ensure only one file is allowed
                            onChange={(e) => {
                              field.onChange(e.target.files); // Ensure field.onChange is called
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Please include any additional information or questions here..."
                            {...field}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isPending} className="w-full" type="submit">
                    {isPending ? "Submitting..." : "submit"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;
