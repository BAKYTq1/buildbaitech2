'use client'
import { useSolutionBanners } from '@/lib/solution/hooks/hooks';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Under from '../ui/under/Under';

const CorporateBlock = () => {
    const { t, i18n } = useTranslation();

  const { data: items = [], isLoading} = useSolutionBanners();
  if (isLoading) return <div className='loader'></div>; 
  return (
    <section className="w-full bg-[#F5F7FA] py-0 pb-[30px]">
      <div className="container mx-auto px-4 xl:px-[0px] max-w-[1280px]">
        <Under text={t('corporateBlock.home')} link={'/'} text1={t('corporateBlock.solution')} />
        <h2 className="text-[20px] font-medium md:text-[24px] font-bold text-[#00162A] mb-10">
                   {t('corporateBlock.title')}
        </h2>
        <div className="flex flex-col gap-12">
          {items.map((item) => {
            const imageUrl = item.existing_images?.[0]?.image || '';

            return (
              <div
                key={item.id}
                className="flex flex-col lg:flex-row items-center lg:items-start w-full gap-8"
              >
                {/* Сүрөт блогу */}
                <div className="relative w-full lg:w-[527px] h-[327px] rounded-2xl overflow-hidden shadow-sm bg-gray-200 flex-shrink-0">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      fill
                      priority={item.id === 1}
                      sizes="(max-width: 768px) 100vw, 527px"
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Текст блогу */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-[24px] font-medium lg:text-[24px] text-[#00162A] mb-4 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-[15px] lg:text-[16px] text-[#4b5563] leading-relaxed mb-6  h-[99px] overflow-hidden line-clamp-4">
                    {item.description}
                  </p>

                  <Link
                    href={`/solutionDetail/${item.id}`}
                    className="w-fit text-[15px] font-bold text-[#10B981] hover:text-[#059669] transition-colors flex items-center gap-2"
                  >
                    {t('corporateBlock.readMore')}
                    <span className="text-xl">→</span>
                  </Link>
                </div>

                <div className="hidden lg:block w-[100px]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CorporateBlock;
