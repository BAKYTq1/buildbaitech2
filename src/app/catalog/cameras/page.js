// app/catalog/cameras/page.js
import { generateCategoryMetadata } from "@/lib/seo"

export const metadata = generateCategoryMetadata({
  title: "Камеры видеонаблюдения в Бишкеке",
  description: "Купить камеры видеонаблюдения в Бишкеке. IP-камеры, CCTV, уличные и внутренние камеры.",
  keywords: ["камеры видеонаблюдения Бишкек", "IP камеры", "CCTV Кыргызстан"],
  slug: "cameras",
})

export default function CamerasPage() {
  return <div>...</div>
}