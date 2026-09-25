import { SiteHeader } from '@/components/header'
import { CatalogView } from '@/components/catalog-view'
import { SiteFooter } from '@/components/footer'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader cartCount={0} />
      <main className="flex-1">
        <CatalogView />
      </main>
      <SiteFooter />
    </div>
  )
}
