import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "../../QueryProvider";
import I18nProvider from "@/provider/I18nProvider/I18nProvider";
import ToastProvider from "@/provider/toastProvider/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://baitech.kg"),
  title: {
    default: "Baitech.kg — Техника и электроника в Бишкеке",
    template: "%s | Baitech.kg",
  },
  description:
    "Интернет-магазин техники в Бишкеке. Камеры видеонаблюдения, компьютеры, телефоны, сетевое оборудование, мониторы. Доставка по Кыргызстану.",
  keywords: [
    "интернет магазин техники Бишкек",
    "купить технику Бишкек",
    "электроника Кыргызстан",
    "baitech",
    "baitech.kg",
  ],
  openGraph: {
    title: "Baitech.kg — Техника и электроника в Бишкеке",
    description: "Камеры, компьютеры, телефоны, сеть, мониторы. Доставка по КР.",
    url: "https://baitech.kg",
    siteName: "Baitech",
    locale: "ru_KG",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://baitech.kg" },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }) { 
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
      >
        <I18nProvider>
        <QueryProvider>
          <ToastProvider/>
        {children}
        </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}