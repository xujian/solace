import { ExternalLink } from "lucide-react"

import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="text-sm text-foreground">
        The page you tried to access does not exist.
      </p>
      <Link
        className="flex gap-x-1 items-center group"
        href="/"
      >
        <span className="text-primary">Go to frontpage</span>
        <ExternalLink
          className="group-hover:rotate-45 ease-in-out duration-150"
          color="var(--fg-interactive)"
        />
      </Link>
    </div>
  )
}
