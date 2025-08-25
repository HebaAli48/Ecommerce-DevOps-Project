import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import URL from "../../../utils/URL";

const ProductImageSwiper = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const mainSwiperRef = useRef(null);

  useEffect(() => {
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.params.navigation.prevEl =
        prevButtonRef.current;
      mainSwiperRef.current.swiper.params.navigation.nextEl =
        nextButtonRef.current;
      mainSwiperRef.current.swiper.navigation.init();
      mainSwiperRef.current.swiper.navigation.update();
    }
  }, []);

  return (
    <div className="w-full h-fit relative">
      {/* Main Swiper for Large Images */}
      <Swiper
        ref={mainSwiperRef}
        loop={true}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 relative"
      >
        {product?.imgsUrls.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${image}`}
              alt={`Product Image ${index + 1}`}
              className="rounded-lg w-full h-[400px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="absolute top-[50%] left-0 right-0 z-50 flex justify-between items-center transform -translate-y-[50%] px-4">
        <button
          ref={prevButtonRef}
          className="custom-swiper-button-prev hover:scale-105 shadow-lg opacity-60"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#D4AF37",
          }}
        >
          <svg
            className="w-6 h-6 rtl:rotate-180 shadow-lg"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </button>

        <button
          ref={nextButtonRef}
          className="custom-swiper-button-next hover:scale-105 shadow-lg opacity-60"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#D4AF37",
          }}
        >
          <svg
            className="w-6 h-6 rtl:rotate-180 shadow-lg"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </button>
      </div>

      {/* Thumbnail Swiper */}
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mt-4"
      >
        {product?.imgsUrls.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${image}`}
              alt={`Thumbnail ${index + 1}`}
              className="rounded-md w-full h-[100px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImageSwiper;
