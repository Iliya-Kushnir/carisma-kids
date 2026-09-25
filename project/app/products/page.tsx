import { SiteHeader } from "@/components/header"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductDetails } from "@/components/product-details"
import { RecommendedProducts } from "@/components/recommended-products"
import { InstagramSection } from "@/components/instagram-section"
import { SiteFooter } from "@/components/footer"

export default function ProductPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <nav aria-label="Хлібні крихти" className="mx-auto max-w-7xl px-4 pt-5 md:px-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <li>
              <a href="#" className="transition-colors hover:text-foreground">
                Головна
              </a>
            </li>
            <li aria-hidden>·</li>
            <li>
              <a href="#" className="transition-colors hover:text-foreground">
                Хлопчикам
              </a>
            </li>
            <li aria-hidden>·</li>
            <li className="text-foreground">Худі street</li>
          </ol>
        </nav>

        {/* Product */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-6 md:px-6 lg:grid-cols-2 lg:gap-12 lg:py-8">
          <ProductGallery />
          <ProductInfo />
        </section>

        <ProductDetails />
        <RecommendedProducts />
        <InstagramSection />
      </main>
      <SiteFooter />
    </div>
  )
}
