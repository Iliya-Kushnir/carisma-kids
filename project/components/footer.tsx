import { MessageCircle, Send } from 'lucide-react'

const CATALOG_LINKS = [
  'Дівчаткам',
  'Хлопчикам',
  'Костюми',
  'Верхній одяг',
  'Взуття',
  'Аксесуари',
]

const INFO_LINKS = [
  'Про нас',
  'Доставка і оплата',
  'Повернення',
  'Контакти',
  'Розмірна сітка',
]

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-background/60">
        {title}
      </h3>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-base text-background/90 transition-colors hover:text-background"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <img
              src="/carisma-logo.png"
              alt="Carisma KIDS"
              className="size-14 shrink-0 rounded-full object-cover"
            />
            <p className="mt-6 max-w-xs text-base leading-relaxed text-background/70">
              Стильний дитячий одяг для найважливіших людей. Будь собою. Завжди.
            </p>
            <div className="mt-8 flex gap-4">
              <a
                href="#"
                aria-label="Чат"
                className="flex size-12 items-center justify-center rounded-full border border-background/30 transition-colors hover:border-background"
              >
                <MessageCircle className="size-5" />
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="flex size-12 items-center justify-center rounded-full border border-background/30 transition-colors hover:border-background"
              >
                <Send className="size-5" />
              </a>
            </div>
          </div>

          <FooterColumn title="Каталог" links={CATALOG_LINKS} />
          <FooterColumn title="Інформація" links={INFO_LINKS} />

          {/* Contacts */}
          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-background/60">
              Контакти
            </h3>
            <ul className="flex flex-col gap-4 text-base text-background/90">
              <li>
                <a href="tel:+380990000000" className="transition-colors hover:text-background">
                  +38 (099) 000 00 00
                </a>
              </li>
              <li>
                <a href="mailto:hello@carisma.kids" className="transition-colors hover:text-background">
                  hello@carisma.kids
                </a>
              </li>
              <li className="text-background/70">Щодня 9:00 – 21:00</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/15">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-6 text-sm text-background/50 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2026 carisma.kids. Усі права захищені.</p>
          <p>Зроблено з любов&apos;ю в Україні</p>
        </div>
      </div>
    </footer>
  )
}
