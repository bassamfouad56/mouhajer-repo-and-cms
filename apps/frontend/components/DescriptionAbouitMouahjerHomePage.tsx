// import React from "react";

// type Props = {};

// const DescriptionAbouitMouahjerHomePage = (props: Props) => {
//   return (
//     <div className="flex justify-center items-center mb-12 ">
//       <div className="text-white max-w-xl text-center">
//         <h4 className="text-4xl   font-bold font-SchnyderS mb-4  ">
//           Top Interior Design Company in Dubai, UAE Region (Founded In
//           1999),
//         </h4>
//         <p className=" opacity-60">
//           Mouhajer International Design Reflects a combination of genuine
//           artistry and culture. A blend of classical design styles from 19th
//           and 20th Century Europe, to modern day contemporary styles, Mouhajer
//           International design takes a brave step in mixing and contrasting
//           colors with contradicting outlines and geometric patterns which is
//           why Mouhajer International design Popularly Known to be the Best
//           Interior Design Company in Dubai, UAE Region. The sophisticated,
//           stylish approach reflect Maher and his team’s imagination, true
//           refinement and taste. With more than 15 years’ experience, Maher
//           Mouhajer has built a team of passionate experts with remarkable
//           attention to detail..
//         </p>
//       </div>
//     </div>
//   );
// };

// export default DescriptionAbouitMouahjerHomePage;
import React from "react";
import AboutDescription from "./AboutDescription";
import { useLocale } from "next-intl";

type Props = {
  title?: string;
  subtitle?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
};

const DescriptionAbouitMouahjerHomePage = ({
  title: titleProp,
  subtitle: subtitleProp,
  showButton = true,
  buttonText: buttonTextProp,
  buttonLink = "/contact-us"
}: Props) => {
  const local = useLocale();

  // Use props if provided, otherwise use defaults
  const title = titleProp || (
    local === "en"
      ? "Top Interior Design Company in Dubai, UAE Region (Founded In 1999),"
      : "أفضل شركة لتصميم الديكور الداخلي في  دبي، الإمارات العربية المتحدة (تأسست في عام 1999)."
  );

  const subtitle = subtitleProp || (
    local === "en"
      ? `Mouhajer International Design
  Reflects a combination of genuine artistry and culture. A blend of classical design styles from 19th and 20th Century Europe, to modern day contemporary styles, Mouhajer International design takes a brave step in mixing and contrasting colors with contradicting outlines and geometric patterns which is why Mouhajer International design Popularly Known to be the Best Interior Design Company in Dubai, UAE Region. The sophisticated, stylish approach reflect Maher and his team's imagination, true refinement and taste. With more than 15 years' experience, Maher Mouhajer has built a team of passionate experts with remarkable attention to detail..`
      : `تعكس "مؤسسة المهاجر الدولية للتصميم" مزيجًا من الفن الأصيل والثقافة. فهي تمزج بين أنماط التصميم الكلاسيكية من أوروبا في القرنين التاسع عشر والعشرين، وأساليب الديكور المعاصرة في العصر الحديث. تأخذ مؤسسة المهاجر الدولية للتصميم خطوة جريئة في مزج الألوان وتناقض الخطوط والأنماط الهندسية، ولهذا السبب تُعتبر مؤسسة المهاجر الدولية للتصميم معروفة بأنها أفضل شركة لتصميم الديكور الداخلي في منطقة دبي، الإمارات العربية المتحدة. النهج المتطور والأنيق يعكس خيال ماهر وفريقه، والرقي الحقيقي والذوق. بخبرة تزيد عن 15 عامًا، قام ماهر المهاجر ببناء فريق من الخبراء المتحمسين ذوي الاهتمام الملحوظ بالتفاصيل.`
  );

  const buttonText = buttonTextProp || (local === "en" ? "Ready To Be Inspired" : "اتصل بخبرائنا الآن!");

  return (
    <AboutDescription
      textwhite
      button={showButton ? buttonText : undefined}
      title={title}
      subtitle={subtitle}
      contact={showButton}
      link={buttonLink}
    />
  );
};

export default DescriptionAbouitMouahjerHomePage;
