import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mouhajer International Design & Contracting",
    short_name: "MIDC",
    description:
      "Award-winning luxury interior design and construction company in Dubai, UAE. Creating timeless spaces since 2009.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#8f7852",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    categories: ["business", "lifestyle", "design"],
    lang: "en",
    dir: "ltr",
    prefer_related_applications: false,
  };
}
