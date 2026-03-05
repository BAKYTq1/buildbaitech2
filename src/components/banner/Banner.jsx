"use client"
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import './HeroBanner.scss';
import { useBanners } from '@/lib/banners/hooks/hooks';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import Image from 'next/image';

export function Banner() {
    const { data: banners = [], isLoading, error } = useBanners('main');
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (isLoading) return <div className="loader"></div>;
    if (error) return null;

  return (
    <div className="hero-banner container">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true, dynamicBullets: false }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={banners.length > 1}
        speed={1000}
        className="hero-banner__swiper"
      >
        {banners.map((banner) => {
          const backgroundImage = banner.existing_images?.[0]?.image;

          return (
            <SwiperSlide key={banner.id}>
              <div className="banner-slide">
                {/* Картинка задаёт высоту блока */}
                {backgroundImage ? (
                  <Image
                    src={backgroundImage}
                    alt={banner.title || 'banner'}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="banner-slide__img"
                    priority
                  />
                ) : (
                  <div className="banner-slide__fallback" />
                )}

                <div className="banner-slide__overlay" />

                <div className="banner-slide__content container">
                  <h1 className="banner-slide__title">{banner.title}</h1>
                  <p className="banner-slide__subtitle">{banner.description || banner.subtitle}</p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        <button ref={prevRef} className="hero-banner__arrow hero-banner__arrow--prev" aria-label="Назад">
          <IoChevronBack size={24} />
        </button>
        <button ref={nextRef} className="hero-banner__arrow hero-banner__arrow--next" aria-label="Вперёд">
          <IoChevronForward size={24} />
        </button>
      </Swiper>
    </div>
  );
}