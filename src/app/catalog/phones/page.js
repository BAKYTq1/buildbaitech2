// app/catalog/phones/page.js
import { generateCategoryMetadata } from "@/lib/seo"

export const metadata = generateCategoryMetadata({
  title: "Смартфоны и телефоны в Бишкеке",
  description: "Купить смартфон в Бишкеке. iPhone, Samsung, Xiaomi. Официальная гарантия.",
  keywords: ["купить смартфон Бишкек", "iPhone Бишкек", "Samsung Бишкек", "Xiaomi КР"],
  slug: "phones",
})

export default function PhonesPage() {
  return <div>...</div>
}