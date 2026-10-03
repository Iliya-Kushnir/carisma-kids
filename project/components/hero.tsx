import Image from "next/image"
import { ArrowRight, Truck, ShieldCheck, RefreshCw } from "lucide-react"

const features = [
  { icon: Truck, title: "Швидка доставка", desc: "1–3 дні" },
  { icon: ShieldCheck, title: "Преміальна якість", desc: "відбірні тканини" },
  { icon: RefreshCw, title: "Легке повернення", desc: "14 днів" },
]

export function Hero() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8">
      <div className="relative overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[16/11] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image
            src="/images/v2/hero.png"
            alt="Двоє дітей у стріт-стайл одязі Carisma Kids"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/45 to-transparent" />

          {/* Copy */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-md px-6 sm:px-10 lg:px-14">
              <h1 className="font-serif text-5xl font-medium leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Carisma
              </h1>
              <span className="mt-1 block font-serif text-2xl font-normal tracking-[0.35em] text-foreground sm:text-3xl lg:text-4xl">
                KIDS
              </span>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground/80 sm:text-base">
                стріт-стайл для маленьких особистостей
              </p>
              <a
                href="/catalog"
                className="mt-6 inline-flex items-center gap-2 bg-background px-6 py-3 text-xs font-semibold tracking-widest text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background"
              >
                ДО КАТАЛОГУ
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div className="bg-foreground text-background">
          <div className="grid grid-cols-1 divide-y divide-background/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3 px-6 py-4">
                <f.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                <div className="leading-tight">
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-xs text-background/60">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
