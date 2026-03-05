'use client';

import React from 'react';
import './CourseDetails.scss';
import { Smile, Layout, ShieldCheck, HeartPulse, GraduationCap } from 'lucide-react';
import img1 from '../../../assets/png/reklama.png';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Under from '../ui/under/Under';

const CourseDetails = () => {
  const { t } = useTranslation();

  const benefits = [
    { icon: <Smile size={32} />, text: t('courseDetails.benefits.0') },
    { icon: <Layout size={32} />, text: t('courseDetails.benefits.1') },
    { icon: <ShieldCheck size={32} />, text: t('courseDetails.benefits.2') },
    { icon: <HeartPulse size={32} />, text: t('courseDetails.benefits.3') },
    { icon: <GraduationCap size={32} />, text: t('courseDetails.benefits.4') }
  ];

  return (
    <div className="course-page">
      <div className="course-container">
        <Under text={t('courseDetails.home')} link={'/'} text1={t('courseDetails.courses')} />
        <header className="course-header">
          <h1 className="course-title">{t('courseDetails.title')}</h1>
          <p className="course-description">{t('courseDetails.description')}</p>
        </header>

        <main className="course-main-info">
          <div className="course-image">
            <div className="image-placeholder">
              <Image src={img1} alt="course image" />
            </div>
          </div>

          <div className="course-program">
            <h3>{t('courseDetails.programTitle')}</h3>
            <div className="program-items">
              {t('courseDetails.program', { returnObjects: true }).map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>
        </main>

        <section className="benefits-section">
          <h2>{t('courseDetails.whatYouGet')}</h2>
          <div className="benefits-grid">
            {benefits.map((item, index) => (
              <div key={index} className="benefit-card">
                <div className="icon-wrapper">{item.icon}</div>
                <p className="benefit-text">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="course-footer">
          <div className="footer-links">
            {t('courseDetails.footerCourses', { returnObjects: true }).map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
  