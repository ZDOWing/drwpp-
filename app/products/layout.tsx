"use client"

import ProductNavigation from "@components/products/shared/ProductNavigation"

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ProductNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
