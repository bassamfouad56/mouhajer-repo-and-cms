"use client";
import React from "react";
import { StickyScroll } from "./utils/sticky-scroll-reveal";
import { useLocale } from "next-intl";

type Props = {};

const BigImageWithEllaborativeText = (props: Props) => {
  const local = useLocale();
  const content = [
    {
      title:
        local === "en"
          ? "Why Mouhajer International Design is the best interior design company in Dubai?"
          : "لماذا تُعتبر مهاجر  للتصميم أفضل شركة لتصميم الديكور الداخلي في دبي؟",
      description: "",
      content: (
        <div className="text-sm lg:text-xl opacity-60 font-Satoshi ">
          <p>
            {local === "en"
              ? `            We at Mouhajer International Design believe that space designing is
            an exceptional art. Our finer capability to bring life to any space
            makes usthe most loved Interior Design Company in Dubai UAE
            (Priority). We are considerably skilled to justify assorted kinds of
            projects for designing (purpose). Right from traditional Arabic to
            modern minimalist, our designing dexterity has no boundaries.
            Fortunately, our clientele has always been diverse. We truly
            understand that every space has its own essence that needs to
            reflect strongly in the décor. The Founder of Mouhajer International
            Design Eng. Maher Mouhajer has been trained educated (Bachelor’)s
            Degree in Interior Design) in London. Along with superb technical
            backdrop, Maher also has a naturally splendid understanding towards
            the architectural domain. Being the Mouhajer International Design
            has been doing some fine work in designing private houses,&nbsp;
            prestigious hotels`
              : `في Mouhajer International Design، نؤمن بأن تصميم الفضاء هو فن فريد من نوعه. قدرتنا الرفيعة على إضفاء الحياة على كل فضاء تجعلنا الشركة المفضلة في مجال تصميم الديكور الداخلي في دبي، الإمارات العربية المتحدة. نتمتع بمهارات استثنائية تمكننا من تحقيق تصاميم متنوعة، من الطابع العربي التقليدي إلى الأسلوب الحديث البسيط. ليس هناك حدود لقدرتنا على التصميم، ولهذا السبب فإن عملائنا متنوعون دائمًا. نحن ندرك بشكل حقيقي أن كل فضاء له جوهره الخاص الذي يجب أن يتم انعكاسه بقوة في التصميم الداخلي. مؤسس Mouhajer International Design، المهندس ماهر المهاجر، لديه خبرة واسعة وخلفية فنية قوية. بفضل هذا، نحن نقدم أعمالًا فنية في تصميم المنازل الفاخرة والفنادق الراقية.`}
          </p>
        </div>
      ),
    },
    {
      title: local === "en" ? ` "How Does Our Process Work?` : `كيف نعمل؟`,
      description: " ",
      content: (
        <div className="text-sm lg:text-xl opacity-60 font-Satoshi ">
          <p>
            {local === "em"
              ? `        Mouhajer International Design works with the greatest precision
            towards every project on hand. The entire process of interior
            designing has been structured in four phases. Knowing the Client
            Requirement We make a thorough analysis of the functional
            requirement of the project keeping the client’s preference
            personality in consideration. Assessment Planning The entire project
            comes on the table for formation. Every element like texture, color,
            shape size is finalized. Project Blueprint Finalization The
            blueprint is presented to the client for final suggestions for
            changes are incorporated. The Show-Down Under the stage, the
            ultimate fit out is executed the final product is presented to the
            client.`
              : `مؤسسة المهاجر الدولية للتصميم تعمل بأقصى دقة في كل مشروع تتولاه. تم تنظيم العملية الكاملة لتصميم الديكور الداخلي في أربع مراحل:

              1. معرفة متطلبات العميل: نقوم بتحليل شامل للمتطلبات الوظيفية للمشروع مع مراعاة تفضيلات العميل وشخصيته.
              
              2. التقييم والتخطيط: يتم تقديم المشروع بأكمله على الطاولة للتشكيل، حيث يتم تحديد كل عنصر مثل القوام واللون والشكل والحجم.
              
              3. استكمال مخطط المشروع: يتم تقديم المخطط للعميل للاقتراحات النهائية وإدراج التغييرات.
              
              4. التنفيذ النهائي: تُنفذ المرحلة النهائية للتجهيز النهائي ويتم تقديم المنتج النهائي للعميل.`}
          </p>
        </div>
      ),
    },
    {
      title:
        local === "en"
          ? "Why We Stand Unique Interior Design Company compare to our competitor?"
          : "لماذا نتميز كشركة تصميم داخلي مقارنة بمنافسينا؟",
      description: "",
      content: (
        <div className="text-sm lg:text-xl opacity-60 font-Satoshi ">
          <p>
            {local === "en"
              ? `We truly understand that Interior Designing has been an ever-changing space. Year on year we witness changing trends & concepts. What makes us a Unique Interior Designing Company is our ability to update & upgrade. Our structural & conceptual innovations are some of the finest designed projects in Dubai. Our unique strength lies in bringing contemporary technology & historical architecture on a common stage. All our clients will endorse for a single fact, which is our knack to present absolute customization. We at Mouhajer International Design take pride in our ability to create sustainable & luxurious spaces with passion`
              : `نحن حقًا ندرك أن تصميم الديكور الداخلي هو مجال متغير باستمرار. سنة بعد سنة، نشهد تغيرات في الاتجاهات والمفاهيم. ما يجعلنا شركة تصميم داخلي فريدة هو قدرتنا على التحديث والتطوير. ابتكاراتنا الهيكلية والمفاهيمية هي بعض من أفضل المشاريع المصممة في دبي. قوتنا الفريدة تكمن في جلب التكنولوجيا المعاصرة والهندسة المعمارية التاريخية على مسرح واحد. سيقوم جميع عملائنا بالتأكيد بتأييد حقيقة واحدة، وهي قدرتنا على تقديم تخصيص مطلق. نحن في مؤسسة المهاجر الدولية للتصميم نفخر بقدرتنا على خلق مساحات مستدامة وفاخرة بشغف.`}
          </p>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="lg:px-40 2xl:px-80 hidden lg:block hidebar">
        <StickyScroll content={content} />
      </div>
      <div className="lg:hidden">
        <div className="p-4">
          <div className="grid gap-4">
            {content?.map((el) => (
              <div className="p-4 rounded shadow" key={el.title}>
                <h4 className="font-SchnyderS text-xl font-bold mb-4">
                  {el.title}
                </h4>
                {el.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BigImageWithEllaborativeText;
