import HeroBanner from "@/components/HeroBanner";
import AboutDescription from "@/components/AboutDescription";
import ServicesTwoImageGallery from "@/components/ServicesTwoImageGallery";
import OurServicesSwiper from "@/components/OurServicesSwiper";
import TwoImagesWithTextAnimation from "@/components/TwoImagesWithTextAnimation";
import ContactForm from "@/components/ContactForm";
import { serviceResData } from "@/components/json/ServicesRes";

// ISR: Revalidate service detail page every 30 minutes (1800 seconds)
// Note: Currently using hardcoded serviceResData - CMS migration pending
export const revalidate = 1800;

type Props = {
  params: {
    slug: string;
  };
};

const page = async (props: Props) => {
  const title = props.params.slug;
  const fetchProjectData = async (slug: string) => {
    // Make the GET request

    const dummyData = serviceResData.find(
      (el) => el.slug.toLocaleLowerCase() === slug.toLocaleLowerCase()
    );
    return dummyData;
  };

  const slugData: any = await fetchProjectData(props.params.slug);

  const { about_title, about_desc, main_image } = slugData?.acf as any;
  const servicesarr = slugData.acf.services_array as any;
  return (
    <div className="bg-[#FFFEF5] overflow-hidden ">
      <HeroBanner
        HomeBannerIamge={main_image}
        maskLayer
        title={title}
        showBreadCrumbs
      />
      <div className="pt-5 2xl:pt-[10rem]">
        <AboutDescription
          button={"READY TO BE INSPIRED?"}
          title={
            about_title
              ? about_title
              : "WE’RE LEADERS IN CULTURALLY CLASSY RESIDENTIAL INTERIOR DESIGN"
          }
          subtitle={
            about_desc
              ? about_desc
              : "Your design vision is our passion.          Since we were founded over two decades ago, we’ve created stunning interiors in over 200 residential villas around the world.          We’ve built up a dedicated team of artisans and designers to make every concept shine in reality. Whether a client wants a richly classical style or something that’s bright with modernity, Mouhajer makes it possible.          Your home is unique to you and our bespoke designs will make your interior design dreams come true."
          }
        />
      </div>
      {slugData?.acf?.gallery_images && (
        <ServicesTwoImageGallery
          images={{
            bigImage: slugData.acf.gallery_images[0] || '',
            smallImage: slugData.acf.gallery_images[1] || '',
            bigImageAlt: slugData.acf.gallery_alt_text?.[0],
            smallImageAlt: slugData.acf.gallery_alt_text?.[1]
          }}
        />
      )}
      {!!servicesarr?.length && <OurServicesSwiper services={servicesarr} />}
      <div className="pt-[3rem] 2xl:pt-[6rem] ">
        <AboutDescription
          title="UNRIVALLED EXPERIENCE IN
        DESIGN"
          subtitle="We take real pride in our portfolio of clientele who have used our residential interior design services in Dubai.
        Let some of our previous work speak for itself… We’ve worked on high-end residential interior design projects for a wide variety of royalty, celebrities, and sporting stars including Lionel Messi. Over the years, we’ve also been proud to partner up with brands like: Bentley, Fendi, and Roberto Cavalli.
        Our expertise brings joy and happiness to clients and we’d love to share that with you too."
        />
      </div>
      <TwoImagesWithTextAnimation />
      <ContactForm />
    </div>
  );
};

export default page;
