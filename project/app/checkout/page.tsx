import type { Metadata } from 'next'
import { SiteHeader } from '@/components/header'
import { SiteFooter } from '@/components/footer'
import { CheckoutView } from '@/components/checkout-view'

export const metadata: Metadata = {
  title: 'Оформлення замовлення — carisma KIDS',
  description:
    'Оформіть замовлення в carisma KIDS: контактні дані, доставка Новою Поштою або Укрпоштою, оплата при отриманні чи онлайн.',
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader cartCount={3} />
      <main className="flex-1">
        <CheckoutView />
      </main>
      <SiteFooter />
    </div>
  )
}
