import Link from "next/link"
import { notFound } from "next/navigation"

import { SiteHeader } from "@/components/header"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductDetails } from "@/components/product-details"
import { RecommendedProducts } from "@/components/recommended-products"
import { InstagramSection } from "@/components/instagram-section"
import { SiteFooter } from "@/components/footer"

import {
  getProductById,
  getRelatedProducts,
} from "@/lib/product-queries"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params

  const product = await getProductById(id)



  if (!product) {
    notFound()
  }

  const recommendedProducts = await getRelatedProducts(
    product,
    5
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">

      <main className="flex-1">
        {/* Breadcrumbs */}
        <nav
          aria-label="Хлібні крихти"
          className="mx-auto max-w-7xl px-4 pt-5 md:px-6"
        >
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                Головна
              </Link>
            </li>



            <li aria-hidden>·</li>

            <li>
              <Link
                href={`/catalog?category=${product.categories[0]}`}
                className="transition-colors hover:text-foreground"
              >
                {product.categories[0] ?? "Каталог"}
              </Link>
            </li>

            <li aria-hidden>·</li>

            <li className="text-foreground">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-6 md:px-6 lg:grid-cols-2 lg:gap-12 lg:py-8">
          <ProductGallery product={product} />

          <ProductInfo product={product} />
        </section>

        <ProductDetails product={product} />

        <RecommendedProducts products={recommendedProducts} />

        <InstagramSection />
      </main>
    </div>
  )
}