"use client";
import React from "react";
import AboutBanner from "./AboutBanner";
import AboutPageGAllery from "./AboutPageGAllery";
import AboutDescription from "./AboutDescription";
import OurAwards from "./OurAwards";
import OurVisionandMission from "./OurVisionandMission";
import AnimatedHeadLine from "./AnimatedHeadLine";
import PressArticles from "./PressArticles";
import AboutHistory from "./AboutHistory";
import OurCLients from "./OurCLients";
import WhatWeDoAboutPage from "./WhatWeDoAboutPage";
import { useLocale } from "next-intl";
import NewSnippetForDubaiBEstInterioirDesign from "./NewSnippetForDubaiBEstInterioirDesign";

type Props = {
  locale?: string;
  pageData?: any;
};

const WhoWeAreComps = ({ locale: localeProp, pageData }: Props) => {
  const local = useLocale();

  // Extract blocks from CMS page data
  const galleryBlock = pageData?.blocks?.find((b: any) => b.type === 'gallery_section');
  const pressArticlesBlock = pageData?.blocks?.find((b: any) => b.type === 'press_articles');
  const visionMissionBlock = pageData?.blocks?.find((b: any) => b.type === 'vision_mission_section');
  const timelineBlock = pageData?.blocks?.find((b: any) => b.type === 'timeline_section');

  return (
    <div className="pt-24 lg:pt-52 bg-[#FFFEF5] relative overflow-hidden">
      <AboutBanner />
      <AboutPageGAllery images={galleryBlock?.data?.images} />
      <AboutDescription
        title={
          local === "en"
            ? "Setting the Gold Standard in Interior Design & Contracting in Dubai"
            : "إن حِرصَنا على المعايير الذهبية يجعلنا واحدة من أهم الشركات الرائدة في دبي بمجال التصميم الداخلي والمقاولات."
        }
        subtitle={
          local === "en"
            ? "Established twenty-five years ago, Mouhajer International Design and Contracting is a prestigious and award-winning firm, renowned for its extensive portfolio and esteemed clients in Dubai and the Middle East. Our highly skilled team ensures that every interior design vision is realised to perfection, from planning to execution, with exceptional aftercare. Our reputation as the top interior designer and contractor in Dubai is well-earned."
            : `تأسست شركة مهاجر إنترناشونال ديزاين منذ 25 عاماً، وهي واحدة من أرقى شركات التصميم الداخلي والمقاولات، الحاصلة على جوائز عالمية، والتي تضم محفظتها الضخمة نخبة من العملاء في دبي والشرق الأوسط. 
يسعى فريق المختصين لدينا إلى تجسيد رؤية التصاميم الخاصة بكل عميل من عملائنا على أرض الواقع، بدءاً من التخطيط والتنفيذ، ووصولاً إلى التسليم، بالإضافة إلى توفير أعلى مستوى الدعم حتى بعد تسليم المشاريع. وهذا ما يجعلنا نرقى لسمعتنا الحسنة كأفضل مصمّمي الديكور الداخلي والمقاولات في دبي.
`
        }
      />
      <OurAwards />
      <OurVisionandMission visionMissionData={visionMissionBlock?.data} />
      {/* <AboutFounder /> */}
      <div className="mt-[28rem]">
        <NewSnippetForDubaiBEstInterioirDesign
          EnTitle="OUR FOUNDER ENGR. MAHER MOUHAJER"
          arTitle="تعرّف على مؤسّس شركتنا المهندس ماهر مهاجر"
          enSubtitle="With a rich professional background and cultural heritage, Eng.
                Maher Mouhajer established Mouhajer International Design and
                Contracting with a deep understanding of his clients' lifestyles"
          arSubtitle="يتمتّع المهندس ماهر بخلفية متنوعة وغنية مهنياً وثقافياً، مما ساعده على فهم متطلبات نمط حياة عملائه من مختلف بلدان العالم. وبفضل دراسته لدرجة البكالوريوس في التصميم الداخلي وتدريبه المهني في الهندسة المعمارية والحرفية في لندن، تمكّن المهندس ماهر من دمج العناصر المعمارية والحرفية مع لمسات رائعة من التراث العربي. فتصاميمه تتميّز بالفخامة والرفاهية مع لمسات من البساطة الحديثة، كما أنه يعتبر كل مشروع بمثابة عمل هو ثمرة تعاونه الوثيق مع العملاء لتزويدهم بتصاميم مصممة خصيصاً كي تناسب أذواقهم الفريدة"
          enDescription="Trained in London with a Bachelor's Degree in interior design, Maher blends architectural and craftsmanship influences with strong Arabic elements. His designs are known for their opulence and grandeur, seamlessly combined with modern minimalism. Each project is a collaborative effort, tailored to the unique tastes of his clients. Maher's skill and vision have positioned the company at the forefront of the international interior design scene, leading to the completion of numerous world-class projects across the Middle East.
Eng Maher Mouhajer Main Interior Design Engineer / Founder / CEO Mouhajer International Design And Contracting"
          arDescription="ومن الجدير بالذكر، أن مهارة المهندس ماهر ورؤيته نجحت بإحراز خطوات متسارعة في مسيرة نمو الشركة المهنية، إلى أن تبوّأت أعلى المراتب في مشهد التصميم الداخلي العالمي، مما أدى إلى إكمالها للعديد من المشاريع ذات المستوى العالمي في جميع أنحاء الشرق الأوسط"
        />
      </div>

      <PressArticles
        articles={pressArticlesBlock?.data?.articles}
        title={pressArticlesBlock?.data?.title}
      />
      <div className="flex overflow-hidden">
        <AnimatedHeadLine
          text={local === "en" ? "History" : "تاريخنا"}
          blackened
        />
        <AnimatedHeadLine
          text={local === "en" ? "History" : "تاريخنا"}
          blackened
        />

        <AnimatedHeadLine
          text={local === "en" ? "History" : "تاريخنا"}
          blackened
        />
      </div>
      <AboutHistory
        timelineItems={timelineBlock?.data?.items}
        sectionTitle={timelineBlock?.data?.title}
      />
      <OurCLients />
      <WhatWeDoAboutPage arr={[]} />
    </div>
  );
};

export default WhoWeAreComps;
