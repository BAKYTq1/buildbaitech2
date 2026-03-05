'use client';
import { useState } from 'react';
import styles from './Navbar.module.scss';
import { LayoutGrid, Monitor, Video, FileText, BookOpen } from 'lucide-react';
import Catalog from '../catalogmenu/Catalog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function NavItem() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname();

  const menuItems = [
    { label: t('navbar.catalog'), icon: <LayoutGrid size={18} />, isCatalog: true },
    { label: t('navbar.pcComponents'), link: '/comlectPK', icon: <Monitor size={18} /> },
    { label: t('navbar.videoSurveillance'), link: '/videosaw', icon: <Video size={18} /> },
    { label: t('navbar.solutions'), link: '/solution', icon: <FileText size={18} /> },
    { label: t('navbar.courses'), link: '/course', icon: <BookOpen size={18} /> },
  ];

  return (
    <>
      <nav className={`${styles.navContainer} container`}>
        {menuItems.map((item, index) => (
          item.isCatalog ? (
            <button
              key={index}
              className={`${styles.navItem} ${open ? styles.navItemActive : ''}`}
              onClick={() => setOpen((prev) => !prev)}
              type="button"
            >
              <span className={styles.label}>{item.label}</span>
              <span className={styles.icon}>{item.icon}</span>
            </button>
          ) : item.link ? (
            <Link
              key={index}
              href={item.link}
              className={`${styles.navItem} ${pathname === item.link ? styles.navItemActive : ''}`}
            >
              <span className={styles.label}>{item.label}</span>
              <span className={styles.icon}>{item.icon}</span>
            </Link>
          ) : (
            <button
              key={index}
              className={styles.navItem}
              type="button"
            >
              <span className={styles.label}>{item.label}</span>
              <span className={styles.icon}>{item.icon}</span>
            </button>
          )
        ))}
      </nav>
      {open && <Catalog onClose={() => setOpen(false)} />}
    </>
  );
}