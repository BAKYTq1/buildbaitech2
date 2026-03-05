export const dynamic = "force-static"
export default function sitemap() {
  return [
    { url: "https://baitech.kg", priority: 1.0, changeFrequency: "weekly" },
    { url: "https://baitech.kg/catalog/cameras", priority: 0.9, changeFrequency: "daily" },
    { url: "https://baitech.kg/catalog/computers", priority: 0.9, changeFrequency: "daily" },
    { url: "https://baitech.kg/catalog/phones", priority: 0.9, changeFrequency: "daily" },
    { url: "https://baitech.kg/catalog/networking", priority: 0.9, changeFrequency: "daily" },
    { url: "https://baitech.kg/catalog/monitors", priority: 0.9, changeFrequency: "daily" },
  ]
}