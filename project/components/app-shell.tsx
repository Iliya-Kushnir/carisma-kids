"use client"

import {
  usePathname,
} from "next/navigation"

import { SiteHeader } from "@/components/header"
import { SiteFooter } from "@/components/footer"

export function AppShell({
  children,
}: {
  children:
    React.ReactNode
}) {
  const pathname =
    usePathname()

  const isAdmin =
    pathname.startsWith(
      "/admin"
    )

  if (isAdmin) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <>
      <SiteHeader />

      {children}

      <SiteFooter />
    </>
  )
}