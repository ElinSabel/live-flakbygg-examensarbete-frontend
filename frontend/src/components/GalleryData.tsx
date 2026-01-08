import { useTranslation } from "react-i18next";
import Image1 from "../assets/gallery/gallery.1.jpg"
import Image2 from "../assets/gallery/gallery.2.jpg"
import Image3 from "../assets/gallery/gallery.3.jpg"
import Image4 from "../assets/gallery/gallery.4.jpg"
import Image5 from "../assets/gallery/gallery.5.jpg"
import Image6 from "../assets/gallery/gallery.6.jpeg"
import Image7 from "../assets/gallery/gallery.7.jpeg"
import Image8 from "../assets/gallery/gallery.8.jpeg"
import Image9 from "../assets/gallery/gallery.9.jpeg"
import Image10 from "../assets/gallery/gallery.10.jpeg"

export const useGalleryData = () => {
  const { t } = useTranslation();

  return [
    {
      id: 1,
      src: Image2,
      title: t("galleryTitle1"),
      description: t("galleryDescription1"),
    },
    {
      id: 2,
      src: Image3,
      title: t("galleryTitle2"),
      description: t("galleryDescription2"),
    },
    {
      id: 3,
      src: Image4,
      title: t("galleryTitle3"),
      description: t("galleryDescription3"),
    },
    {
      id: 4,
      src: Image1,
      title: t("galleryTitle4"),
      description: t("galleryDescription4"),
    },
    {
      id: 5,
      src: Image5,
      title: t("galleryTitle5"),
      description: t("galleryDescription5"),
    },
     {
      id: 6,
      src: Image6,
      title: t("galleryTitle6"),
      description: t("galleryDescription6"),
    },
     {
      id: 7,
      src: Image7,
      title: t("galleryTitle7"),
      description: t("galleryDescription7"),
    },
     {
      id: 8,
      src: Image8,
      title: t("galleryTitle8"),
      description: t("galleryDescription8"),
    },
     {
      id: 9,
      src: Image9,
      title: t("galleryTitle9"),
      description: t("galleryDescription9"),
    },
     {
      id: 10,
      src: Image10,
      title: t("galleryTitle10"),
      description: t("galleryDescription10"),
    },
  ];
};