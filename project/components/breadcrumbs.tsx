import { ChevronRight } from 'lucide-react'

export function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <nav aria-label="Хлібні крихти">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-foreground">{item}</span>
              ) : (
                <a href="#" className="transition-colors hover:text-foreground">
                  {item}
                </a>
              )}
              {!isLast && (
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
