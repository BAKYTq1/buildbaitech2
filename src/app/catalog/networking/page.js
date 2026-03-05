// app/catalog/networking/page.js
import { generateCategoryMetadata } from "@/lib/seo"

export const metadata = generateCategoryMetadata({
  title: "Сетевое оборудование в Бишкеке",
  description: "Роутеры, коммутаторы, Wi-Fi оборудование. TP-Link, Mikrotik, Cisco в Бишкеке.",
  keywords: ["роутер Бишкек", "Mikrotik Кыргызстан", "сетевое оборудование КР"],
  slug: "networking",
})

export default function NetworkingPage() {
  return <div>...</div>
}