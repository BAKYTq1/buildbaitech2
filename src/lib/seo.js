// lib/seo.js
export function generateCategoryMetadata({ title, description, keywords, slug }) {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | Baitech.kg`,
      description,
      url: `https://baitech.kg/catalog/${slug}`,
      siteName: "Baitech",
      locale: "ru_KG",
      type: "website",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    alternates: { canonical: `https://baitech.kg/catalog/${slug}` },
  }
}