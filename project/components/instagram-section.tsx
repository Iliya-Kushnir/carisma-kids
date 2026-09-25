import Image from "next/image"
import { MessageCircle } from "lucide-react"

const gridPhotos = ["/instagram/ig-1.png", "/instagram/ig-2.png", "/instagram/ig-3.png"]
const stripPhotos = ["/instagram/ig-1.png", "/instagram/ig-2.png", "/instagram/ig-3.png"]

function MiniPhone() {
  return (
    <div className="w-44 shrink-0 rounded-[1.75rem] border-[5px] border-foreground bg-secondary p-2.5 shadow-lg">
      <div className="flex items-center justify-between px-1 text-[0.5rem] font-medium">
        <span>9:41</span>
        <span className="font-semibold">carisma.kids</span>
        <span className="w-4" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <span className="text-center font-serif text-[0.5rem] font-semibold leading-none">Carisma</span>
        </div>
        <dl className="flex flex-1 justify-between gap-0.5 text-center">
          {[
            ["432", "постів"],
            ["12K", "підписників"],
            ["7", "підписки"],
          ].map(([num, label]) => (
            <div key={label}>
              <dt className="text-[0.55rem] font-bold">{num}</dt>
              <dd className="text-[0.4rem] text-muted-foreground">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="text-[0.55rem] font-semibold">Carisma Kids</p>
        <p className="text-[0.45rem] text-muted-foreground">Дитячий одяг у стилі стріт-стайл</p>
        <p className="text-[0.45rem] text-muted-foreground">Преміальна якість</p>
      </div>
      <button className="mt-2 w-full rounded-md bg-foreground py-1.5 text-[0.5rem] font-medium text-background">
        Підписатися
      </button>
      <div className="mt-2 grid grid-cols-3 gap-0.5">
        {gridPhotos.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-[2px]">
            <Image src={src || "/placeholder.svg"} alt="" fill className="object-cover" sizes="60px" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function InstagramSection() {
  return (
    <section className="bg-muted">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 md:px-6 lg:flex-row lg:gap-10">
        <div className="hidden sm:block">
          <MiniPhone />
        </div>

        <div className="flex-1 text-center lg:text-left">
          <h2 className="font-serif text-xl font-bold uppercase tracking-tight md:text-2xl">
            Підписуйся на Instagram
          </h2>
          <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-muted-foreground lg:mx-0">
            Новинки, луки, знижки та багато натхнення щодня
          </p>
          <a
            href="#"
            className="mt-4 inline-flex items-center gap-2 bg-foreground px-6 py-3 text-xs font-semibold tracking-wide text-background transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-4" />
            @carisma.kids
          </a>
        </div>

        <div className="flex gap-3">
          {stripPhotos.map((src, i) => (
            <div key={i} className="relative aspect-square w-24 overflow-hidden md:w-28">
              <Image src={src || "/placeholder.svg"} alt="Carisma Kids street style" fill className="object-cover" sizes="112px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
