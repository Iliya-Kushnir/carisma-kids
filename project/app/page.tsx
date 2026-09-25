import { SiteHeader } from "@/components/header"
import { Hero } from "@/components/hero"
import { PromoBlocks } from "@/components/promo-blocks"
import { CategoryGrid } from "@/components/category-grid"
import { PopularProducts } from "@/components/popular-products"
import { InstagramSection } from "@/components/instagram-section"
import { SiteFooter } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="pt-4 lg:pt-6">
          <Hero />
        </div>
        <PromoBlocks />
        <CategoryGrid />
        <PopularProducts />
        <InstagramSection />
      </main>
      <SiteFooter />
    </div>
  )
}
