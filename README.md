# Solace Store

a monorepo that stitches together three opinionated workspaces:

| Workspace | Stack | What it does |
|--------------|---------------|-------------------|
| `api/`       | Medusa 2, TypeScript, PostgreSQL (or SQLite)| Core commerce logic, checkout flows, pricing, inventory, and webhooks. |
| `storefront/`| Next.js 15 App Router, Tailwind, Medusa SDK | Customer-facing shop that talks directly to the Medusa publishable API. |
| `cms/` | Strapi 5 | Marketing + editorial content surfaced inside the storefront.                |

The root `package.json` keeps everything in sync through pnpm workspaces, so you install dependencies and run scripts once at the top-level.

## Quickstart

```bash
pnpm install
pnpm dev  # spawns dev servers for api, cms, and storefront in parallel
```

Default local ports:

| Service     | Port | Notes                                             |
|-------------|------|---------------------------------------------------|
| Medusa API  | 9000 | REST + publishable API key for the storefront.    |
| Strapi CMS  | 1337 | GraphQL/REST for marketing pages.                 |
| Storefront  | 8000 | Next.js dev server w/ Turbopack.                  |

### Minimal environment setup

Create `.env` files inside each workspace (they are git-ignored). Copy/paste and adjust:

```bash
# api/.env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/solace
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:5173,http://localhost:9000
AUTH_CORS=http://localhost:5173
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret

# cms/.env
HOST=0.0.0.0
PORT=1337
APP_KEYS=devkey1,devkey2
API_TOKEN_SALT=random-salt
ADMIN_JWT_SECRET=random-secret
TRANSFER_TOKEN_SALT=random-salt

# storefront/.env.local
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<publishable-key-from-medusa>
MEDUSA_BACKEND_URL=http://localhost:9000
```

Generate the Medusa publishable key once the API is running:

```bash
pnpm --filter api run medusa user --publishable-key
```

### Service-specific commands

```bash
# API
pnpm --filter api run dev        # http://localhost:9000
pnpm --filter api run seed       # seeds demo products/orders

# CMS
pnpm --filter cms run develop    # http://localhost:1337/admin
pnpm --filter cms run seed:example

# Storefront
pnpm --filter storefront run dev # http://localhost:8000
pnpm --filter storefront run lint
```

## Common workflows

- **Rebuild everything:** `pnpm build`
- **One-off script:** `pnpm --filter api exec ts-node src/scripts/seed.ts`
- **Lint storefront only:** `pnpm --filter storefront run lint`
- **Add a new dependency to one package:** `pnpm --filter <pkg> add <name>`

## Troubleshooting

- Storefront exits immediately → you’re missing `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`; run `pnpm --filter api medusa publishable-key`.
- API rejects CORS → ensure `STORE_CORS`, `ADMIN_CORS`, and `AUTH_CORS` include the scheme + port of the caller.
- Strapi complains about missing `APP_KEYS` → regenerate with `openssl rand -base64 32` and update `cms/.env`.

## Next steps

- Customize Medusa workflows under `api/src/workflows`.
- Extend Strapi components in `cms/src/components` to drive new landing pages.
- Drop new modules into `storefront/src/modules` and wire them up via `app/[countryCode]`.

