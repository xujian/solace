import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: '404',
  description: 'Something went wrong'
}

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="text-sm text-foreground">
        The page you tried to access does not exist.
      </p>
      <Link className="group flex items-center gap-x-1" href="/">
        <span className="text-primary">Go to frontpage</span>
        <ExternalLink
          className="duration-150 ease-in-out group-hover:rotate-45"
          color="var(--fg-interactive)"
        />
      </Link>
    </div>
  )
}
