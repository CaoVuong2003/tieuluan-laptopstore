import React, { useState, useEffect, useRef } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BannerLaptopImg from "../../assets/img/banner_laptop.jpg";
import BannerGamingImg from "../../assets/img/banner_gaming.jpg";
import BannerOfficeImg from "../../assets/img/banner_office.jpg";
import BannerSmall1 from "../../assets/img/banner_small1.jpg";
import BannerSmall2 from "../../assets/img/banner_small2.jpg";

const banners = [
  { image: BannerLaptopImg, link: "/laptop" },
  { image: BannerGamingImg, link: "/linh-kien" },
  { image: BannerOfficeImg, link: "/phu-kien" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  // Hàm reset auto slide
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Auto slide sau 5 giây
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => resetTimeout();
  }, [current]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 lg:px-12 py-6">
      {/* Banner lớn bên trái */}
      <div className="relative col-span-2 h-[400px] lg:h-[450px] overflow-hidden rounded-xl">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
              ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <a href={banner.link}>
              <img
                src={banner.image}
                alt="banner"
                className="w-full h-full object-cover rounded-xl cursor-pointer"
              />
            </a>
          </div>
        ))}

        {/* Nút điều hướng */}
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute top-1/2 left-4 transform -translate-y-1/2 
          bg-black/50 text-white w-12 h-12 rounded-full hover:bg-black transition z-20 
          items-center justify-center"
        >
          <ArrowBackIosIcon className="text-2xl ml-2" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:flex absolute top-1/2 right-4 transform -translate-y-1/2 
          bg-black/50 text-white w-12 h-12 rounded-full hover:bg-black transition z-20 
          flex items-center justify-center"
        >
          <ArrowForwardIosIcon className="text-2xl" />
        </button>


        {/* Indicators */}
        <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
          {banners.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full cursor-pointer transition 
                ${idx === current ? "bg-white" : "bg-gray-400"}`}
            ></span>
          ))}
        </div>
      </div>

      {/* Banner nhỏ bên phải */}
      <div className="flex flex-col gap-4">
        <a href="/phu-kien">
          <img
            src={BannerSmall1}
            alt="Promo 1"
            className="w-full h-[195px] lg:h-[220px] object-cover rounded-xl cursor-pointer"
          />
        </a>
        <a href="/linh-kien">
          <img
            src={BannerSmall2}
            alt="Promo 2"
            className="w-full h-[195px] lg:h-[220px] object-cover rounded-xl cursor-pointer"
          />
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
