import SolutionDetailPage from '@/components/solution/SolutionDetail'
import React from 'react'

export const dynamicParams = false

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://baitech.kg"
const SOLUTIONS_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/banners/banners/?category=solution`
const FALLBACK_IDS = ["1", "2", "3"]

export async function generateStaticParams() {
  try {
    const response = await fetch(SOLUTIONS_API_URL, {
      headers: { "ngrok-skip-browser-warning": "true" },
      cache: "no-store",
    })

    if (!response.ok) {
      return FALLBACK_IDS.map((id) => ({ id }))
    }

    const data = await response.json()
    const solutions = Array.isArray(data) ? data : data?.results || []
    const params = solutions
      .filter((s) => s?.id !== undefined && s?.id !== null)
      .map((s) => ({ id: String(s.id) }))

    return params.length > 0 ? params : FALLBACK_IDS.map((id) => ({ id }))
  } catch {
    return FALLBACK_IDS.map((id) => ({ id }))
  }
}

export default function Page() {
  return (
    <>
      <SolutionDetailPage/>
    </>
  )
}