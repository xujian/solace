import type { NextConfig } from 'next'


const c = require('ansi-colors')

const requiredEnvs = [
  {
    key: 'NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY',
    description:
      'Learn how to create a publishable key: https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys'
  }
]

function checkEnvVariables() {
  const missingEnvs = requiredEnvs.filter(env => !process.env[env.key])

  if (missingEnvs.length > 0) {
    console.error(
      c.red.bold('\n🚫 Error: Missing required environment variables\n')
    )

    missingEnvs.forEach(env => {
      console.error(c.yellow(`  ${c.bold(env.key)}`))
      if (env.description) {
        console.error(c.dim(`    ${env.description}\n`))
      }
    })

    console.error(
      c.yellow(
        '\nPlease set these variables in your .env file or environment before starting the application.\n'
      )
    )

    process.exit(1)
  }
}

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

const nextConfig: NextConfig = {
  // cacheComponents: true,
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true
    }
  },

  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337'
      },
      {
        protocol: 'https',
        hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'medusa-server-testing.s3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'medusa-server-testing.s3.us-east-1.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'solace-medusa-starter-storage.fra1.digitaloceanspaces.com'
      },
      ...(S3_HOSTNAME
        ? [
            {
              protocol: 'https' as const,
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME || ''
            }
          ]
        : [])
    ]
  }
}

export default nextConfig
