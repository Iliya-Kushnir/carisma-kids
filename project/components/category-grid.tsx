import Link from "next/link"

import {
  Shirt,
  Footprints,
} from "lucide-react"

import type {
  LucideIcon,
} from "lucide-react"

import type {
  JSX,
} from "react"

function HoodieIcon(
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 3h8l4 5-3 2v11H7V10L4 8z" />
      <path d="M9 3c0 2 1.5 3 3 3s3-1 3-3" />
      <path d="M12 6v6" />
    </svg>
  )
}

function PantsIcon(
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 3h10l-.5 18h-4L12 10l-.5 11h-4z" />
      <path d="M7 3l.5 6h9L17 3" />
    </svg>
  )
}

function JacketIcon(
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 3l4 3 4-3 4 4-3 3v10h-4V9m-2 0v11H7V10L4 7z" />
      <path d="M12 6v14" />
    </svg>
  )
}

function CapIcon(
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 15c0-5 3.6-8 8-8s8 3 8 8" />
      <path d="M20 15c1.5 0 2 .8 2 1.5S21 18 20 18H4" />
      <path d="M12 7V4" />
    </svg>
  )
}

type CategoryItem = {
  label: string

  Icon:
    | LucideIcon
    | ((
        props: React.SVGProps<SVGSVGElement>
      ) => JSX.Element)

  href: string
}

const categories: CategoryItem[] = [
  {
    label: "Футболки",
    Icon: Shirt,
    href:
      "/catalog?category=Футболки",
  },

  {
    label: "Худі та світшоти",
    Icon: HoodieIcon,
    href:
      "/catalog?category=Худі&category=Світшоти",
  },

  {
    label: "Штани",
    Icon: PantsIcon,
    href:
      "/catalog?category=Штани&category=Джинси",
  },

  {
    label: "Верхній одяг",
    Icon: JacketIcon,
    href:
      "/catalog?category=Куртки",
  },

  {
    label: "Взуття",
    Icon: Footprints,
    href:
      "/catalog?category=Взуття",
  },

  {
    label: "Аксесуари",
    Icon: CapIcon,
    href:
      "/catalog?category=Аксесуари",
  },
]

export function CategoryGrid() {
  return (
    <section className="bg-secondary py-8 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 md:grid-cols-6">
          {categories.map(
            ({
              label,
              Icon,
              href,
            }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-3 text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background transition-transform group-hover:scale-105">
                  <Icon
                    className="h-7 w-7 text-foreground"
                    aria-hidden="true"
                  />
                </span>

                <span className="text-xs font-medium text-foreground/80">
                  {label}
                </span>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  )
}