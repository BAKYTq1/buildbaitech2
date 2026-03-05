// app/catalog/monitors/page.js
import { generateCategoryMetadata } from "@/lib/seo"

export const metadata = generateCategoryMetadata({
  title: "Мониторы в Бишкеке",
  description: "Купить монитор в Бишкеке. Игровые и офисные мониторы Samsung, LG, AOC.",
  keywords: ["мониторы Бишкек", "игровой монитор КР", "Samsung монитор Бишкек"],
  slug: "monitors",
})

export default function MonitorsPage() {
  return <div>...</div>
}