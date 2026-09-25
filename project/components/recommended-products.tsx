import Image from "next/image"
import { Heart } from "lucide-react"

const products = [
  { name: "Джинси wide", price: "990 грн", image: "/products/p-jeans.png", colors: ["#1f2937", "#3b4a63", "#6b7280"] },
  { name: "Футболка basic", price: "590 грн", image: "/products/p-tshirt.png", colors: ["#1f2937", "#c9bda8"] },
  {
    name: "Світшот oversize",
    price: "790 грн",
    image: "/products/p-sweatshirt.png",
    colors: ["#c9bda8", "#1f2937", "#6b7280"],
  },
  { name: "Штани street", price: "890 грн", image: "/products/p-pants.png", colors: ["#1f2937", "#3b4a63"] },
  { name: "Кепка classic", price: "430 грн", image: "/products/p-cap.png", colors: ["#1f2937", "#c9bda8"] },
]

export function RecommendedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold uppercase tracking-tight md:text-xl">Також може сподобатись</h2>
        <a
          href="#"
          className="shrink-0 text-xs font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Дивитись усі
        </a>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
        {products.map((product) => (
          <a key={product.name} href="#" className="group flex flex-col gap-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background">
                <Heart className="size-4" />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-sm font-bold">{product.price}</p>
              <div className="flex gap-1.5">
                {product.colors.map((c, i) => (
                  <span
                    key={i}
                    className="size-3 rounded-full border border-border"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
