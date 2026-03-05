// app/catalog/computers/page.js
import { generateCategoryMetadata } from "@/lib/seo"

export const metadata = generateCategoryMetadata({
  title: "Компьютеры и ноутбуки в Бишкеке",
  description: "Купить компьютеры и ноутбуки в Бишкеке. Игровые ПК, офисные ноутбуки.",
  keywords: ["купить ноутбук Бишкек", "компьютеры Бишкек", "игровой ноутбук КР"],
  slug: "computers",
})

export default function ComputersPage() {
  return <div>...</div>
}