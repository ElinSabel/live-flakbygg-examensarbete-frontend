import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGalleryData } from "../components/GalleryData";

export const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t } = useTranslation();
  const galleryData = useGalleryData();

  const openLightbox = (index: number) => {
    setActiveIndex(index);
  };

  const closeLightbox = () => {
    setActiveIndex(null);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) =>
      prev === null ? null : (prev + 1) % galleryData.length
    );
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) =>
      prev === null
        ? null
        : (prev - 1 + galleryData.length) % galleryData.length
    );
  };

  return (
    <>
      <h1>{t("gallery")}</h1>
      <p className="intro centerText">
        {t("galleryIntro")}
      </p>

      <div className="pictureGrid">
        {galleryData.map((img, index) => (
          <div
            className="galleryCard"
            key={img.id}
            onClick={() => openLightbox(index)}
          >
            <img src={img.src} alt={img.title} />
            <div className="cardInfo">
              <h3 className="centerText">{img.title}</h3>
              <p className="centerText">{img.description}</p>
            </div>
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="lightboxOverlay" onClick={closeLightbox}>
          <div
            className="lightboxContent"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="prevBtn" onClick={showPrev}>
              &lt;
            </button>

            <div className="lightboxInner">
              <img
                src={galleryData[activeIndex].src}
                alt={galleryData[activeIndex].title}
              />
              <div className="lightboxInfo">
                <h2>{galleryData[activeIndex].title}</h2>
                <p className="centerText">{galleryData[activeIndex].description}</p>
              </div>
            </div>

            <button className="nextBtn" onClick={showNext}>
              &gt;
            </button>
            <button className="closeBtn" onClick={closeLightbox}>
              ✖
            </button>
          </div>
        </div>
      )}
    </>
  );
};