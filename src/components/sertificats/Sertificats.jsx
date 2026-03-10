"use client";

import React from 'react';
import './Certificates.scss';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { useCertificat } from '@/lib/sertificats/hooks/hooks';

const Certificates = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useCertificat();

  const certificates = data?.results || data || [];

  if (isLoading) return <div className="loader"></div>;

  return (
    <section className="certificates-page">
      <div className="container-1220">
        <nav className="breadcrumbs">
          <Link href="/">{t('certificates.breadcrumbs.home')}</Link>
          <span className="sep">/</span>
          <span className="active">{t('certificates.breadcrumbs.current')}</span>
        </nav>

        <h1 className="title-h1">{t('certificates.title')}</h1>
        <p className="desc-main">{t('certificates.description')}</p>
        <h2 className="title-h2">{t('certificates.subtitle')}</h2>

        <div className="cert-grid">
          {certificates.map((card) => {
            const imageSrc = card.existing_images?.[0]?.image;
            return (
              <div key={card.id} className="cert-card">
                {card.title && <h3 className="cert-card-title">{card.title}</h3>}
                <div className="img-wrapper">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={card.title || card.category_display || 'certificate'}
                      width={585}
                      height={335}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="placeholder-img">585 x 335</div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="cert-footer-text">
            {t('certificates.footer', { returnObjects: true }).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;