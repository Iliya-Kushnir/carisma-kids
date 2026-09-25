"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const images = [
  { src: "/products/hoodie-1.png", alt: "Худі street — основне фото" },
  { src: "/products/hoodie-2.png", alt: "Худі street — вигляд сидячи" },
  { src: "/products/hoodie-3.png", alt: "Худі street — вид ззаду" },
  { src: "/products/hoodie-4.png", alt: "Худі street — деталі" },
]

export function ProductGallery() {
  const [active, setActive] = useState(0)
  const [liked, setLiked] = useState(false)

  return (
    <div className="flex gap-3 md:gap-4">
      {/* Thumbnails */}
      <div className="flex w-16 flex-col gap-3 md:w-20">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setActive(i)}
            aria-label={`Показати фото ${i + 1}`}
            className={cn(
              "relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-muted transition",
              active === i ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100",
            )}
          >
            <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover" sizes="80px" />
          </button>
        ))}
        <button
          aria-label="Більше фото"
          className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground transition hover:text-foreground"
        >
          <ChevronDown className="size-5" />
        </button>
      </div>

      {/* Main image */}
      <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-muted">
        <Image
          src={images[active].src || "/placeholder.svg"}
          alt={images[active].alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 80vw, 40vw"
        />
        <button
          onClick={() => setLiked((v) => !v)}
          aria-label="Додати в обране"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
        >
          <Heart className={cn("size-4", liked && "fill-foreground")} />
        </button>
      </div>
    </div>
  )
}
