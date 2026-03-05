export const dynamic = "force-static"
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",        // API роуты — не нужны Google
          "/admin/",      // админка
          "/_next/",      // Next.js служебные файлы
          "/checkout/",   // страница оплаты
          "/cart/",       // корзина
          "/profile/",    // личный кабинет
        ],
      },
    ],
    sitemap: "https://baitech.kg/sitemap.xml",
  }
}