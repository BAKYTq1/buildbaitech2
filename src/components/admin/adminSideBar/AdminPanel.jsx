"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Импортируем иконки
import {
  Package,
  Truck,
  Image as ImageIcon,
  Users,
  Settings,
  BookOpen,
  FileText,
  Award,
  Info,
  LogOut
} from "lucide-react";
import { useLogout } from "@/lib/auth/hooks/hooks";
import "./AdminPanel.scss";

const AdminPanel = () => {
  const pathname = usePathname();
  const menuRef = useRef(null);
  const itemRefs = useRef({});
  const { mutate: logout } = useLogout();

  const [indicatorPosition, setIndicatorPosition] = useState({ top: 0, height: 40 });
  const [activeIndex, setActiveIndex] = useState(0);

  // Добавляем иконки в конфиг
  const menuItems = [
    { id: 0, text: "Товары", path: "/camera", icon: <Package size={22} /> },
    { id: 1, text: "Заказы", path: "/order-table", icon: <Truck size={22} /> },
    { id: 2, text: "Баннеры", path: "/banners", icon: <ImageIcon size={22} /> },
    { id: 3, text: "Пользователи", path: "/users-table", icon: <Users size={22} /> },
    { id: 4, text: "Настройки сайта", path: "/setting-web", icon: <Settings size={22} /> },
    // { id: 5, text: "Курсы", path: "/courses", icon: <BookOpen size={22} /> },
    // { id: 6, text: "Решение", path: "/resalts", icon: <FileText size={22} /> },
    // { id: 7, text: "Сертификаты", path: "/certs", icon: <Award size={22} /> },
    // { id: 8, text: "О компании", path: "/about", icon: <Info size={22} /> },
  ];

  const updateIndicatorPosition = (index) => {
    const itemElement = itemRefs.current[index];
    if (itemElement && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const itemRect = itemElement.getBoundingClientRect();
      const topPos = itemRect.top - menuRect.top;
      setIndicatorPosition({ top: topPos, height: itemRect.height });
      menuRef.current.style.setProperty("--indicator-top", `${topPos}px`);
    }
  };

  const handleItemClick = (index) => {
    setActiveIndex(index);
    localStorage.setItem("adminPanelActiveIndex", index.toString());
  };

  useEffect(() => {
    const saved = localStorage.getItem("adminPanelActiveIndex");
    if (saved !== null) setActiveIndex(parseInt(saved));
  }, []);

  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => item.path === pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
      updateIndicatorPosition(currentIndex);
    }
  }, [pathname]);

  return (
    <div className="admin-panel">
      <h2 className="admin-title">Админ панель</h2>
      <nav className="admin-nav">
        <ul className="admin-menu" ref={menuRef}>
          {menuItems.map((item, index) => (
            <li key={item.id} className="admin-menu-item">
              <Link
                href={item.path}
                className={`admin-menu-link ${pathname === item.path ? "active" : ""}`}
                onClick={() => handleItemClick(index)}
                ref={(el) => (itemRefs.current[index] = el)}
              >
                <div className="icon-text-container">
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-text">{item.text}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="admin-logout-container">
        <button className="admin-logout-btn" onClick={() => logout()}>
          <LogOut size={22} />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;