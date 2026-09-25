import Image from "next/image"

const cards = [
  { title: "ХЛОПЧИКАМ", image: "/images/v2/cat-boys.png" },
  { title: "ДІВЧАТКАМ", image: "/images/v2/cat-girls.png" },
  { title: "НОВИНКИ", image: "/images/v2/cat-new.png" },
  { title: "БЕСТСЕЛЕРИ", image: "/images/v2/cat-best.png" },
]

export function PromoBlocks() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="group relative aspect-[3/4] overflow-hidden"
          >
            <Image
              src={card.image || "/placeholder.svg"}
              alt={card.title}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5">
              <h3 className="font-serif text-xl font-medium tracking-wide text-background sm:text-2xl">
                {card.title}
              </h3>
              <a
                href="#"
                className="inline-flex items-center border border-background/70 bg-background/10 px-4 py-2 text-[10px] font-semibold tracking-widest text-background backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
              >
                ПЕРЕГЛЯНУТИ
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
