import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ProductForm } from "@/components/admin/product-form"

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Назад до товарів
        </Link>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Каталог
        </p>

        <h1 className="text-3xl font-bold">
          Новий товар
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Заповніть інформацію про товар, додайте кольори,
          розміри, залишки та фотографії.
        </p>
      </div>

      <ProductForm />
    </div>
  )
}