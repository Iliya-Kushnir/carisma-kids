import { SiteHeader } from '@/components/header'
import { CatalogView } from '@/components/catalog-view'
import { SiteFooter } from '@/components/footer'
import { getProducts } from '@/lib/product-queries'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const products = await getProducts()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <CatalogView products={products} />
      </main>
    </div>
  )
}