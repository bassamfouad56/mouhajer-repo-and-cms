import Image from 'next/image';
import { useLocale } from 'next-intl';
import { PLACEHOLDER_IMAGE } from '@/lib/image-utils';

type Props = {
  founderImage?: string;
};

const AboutFounder = ({ founderImage }: Props) => {
  const local = useLocale();
  return (
    <div className="bg-[#F2F1E5]">
      <div className="pt-64 2xl:pt-128 2xl:pr-78 2xl:py-72 pb-14 2xl:pb-0">
        <div className="2xl:pl-54 mx-auto">
          <div className="grid lg:grid-cols-12 2xl:min-h-240 lg:translate-x-[15%]">
            <div className="min-h-96 sm:min-h-220 lg:min-h-0 w-screen lg:w-full  lg:col-span-5 relative ">
              <Image
                className="absolute w-full h-full object-cover"
                src={founderImage || PLACEHOLDER_IMAGE}
                alt="Engineer Maher Mouhajer - Founder & CEO"
                fill
              />
            </div>
            <div className="hidden lg:col-span-1"></div>
            <div className="col-span-5 text-[#2C2B2B] relative px-12 mt-12">
              <p className="uppercase font-Satoshi mb-12 2xl:mb-24">
                {local === 'en'
                  ? 'OUR FOUNDER ENGR. MAHER MOUHAJER'
                  : `تعرّف على مؤسّس شركتنا المهندس ماهر مهاجر`}
              </p>
              <h4 className="font-SchnyderS text-3xl font-light mb-[3.2rem] max-w-2xl">
                {local === 'en'
                  ? `
                With a rich professional background and cultural heritage, Eng.
                Maher Mouhajer established Mouhajer International Design and
                Contracting with a deep understanding of his clients' lifestyles`
                  : `يتمتّع المهندس ماهر بخلفية متنوعة وغنية مهنياً وثقافياً، مما ساعده على فهم متطلبات نمط حياة عملائه من مختلف بلدان العالم. وبفضل دراسته لدرجة البكالوريوس في التصميم الداخلي وتدريبه المهني في الهندسة المعمارية والحرفية في لندن، تمكّن المهندس ماهر من دمج العناصر المعمارية والحرفية مع لمسات رائعة من التراث العربي. فتصاميمه تتميّز بالفخامة والرفاهية مع لمسات من البساطة الحديثة، كما أنه يعتبر كل مشروع بمثابة عمل هو ثمرة تعاونه الوثيق مع العملاء لتزويدهم بتصاميم مصممة خصيصاً كي تناسب أذواقهم الفريدة.`}
              </h4>
              <p className="font-Satoshi text-base leading-6 max-w-xl line-clamp-14">
                {local === 'en'
                  ? `Trained in London with a Bachelor's Degree in interior design, Maher blends architectural and craftsmanship influences with strong Arabic elements. His designs are known for their opulence and grandeur, seamlessly combined with modern minimalism. Each project is a collaborative effort, tailored to the unique tastes of his clients. Maher's skill and vision have positioned the company at the forefront of the international interior design scene, leading to the completion of numerous world-class projects across the Middle East.
Eng Maher Mouhajer Main Interior Design Engineer / Founder / CEO Mouhajer International Design And Contracting`
                  : `ومن الجدير بالذكر، أن مهارة المهندس ماهر ورؤيته نجحت بإحراز خطوات متسارعة في مسيرة نمو الشركة المهنية، إلى أن تبوّأت أعلى المراتب في مشهد التصميم الداخلي العالمي، مما أدى إلى إكمالها للعديد من المشاريع ذات المستوى العالمي في جميع أنحاء الشرق الأوسط.`}
              </p>
              <div className="mt-4 2xl:absolute bottom-10">
                <p className="font-Satoshi font-semibold mb-[10px]">
                  {local === 'en' ? `` : `لمهندس ماهر مهاجر`}
                </p>
                <p className="opacity-50 text-sm">
                  {local === 'en'
                    ? `  Main Interior Design Engineer / Owner / CEO mouhajer
                  international design`
                    : `مهندس التصميم الداخلي الرئيسي / المؤسس / المدير التنفيذي لشركة مهاجر إنترناشونال ديزاين`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutFounder;
