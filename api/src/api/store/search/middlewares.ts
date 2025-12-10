import { MiddlewareRoute } from '@medusajs/framework'
import { validateAndTransformQuery } from '@medusajs/framework'
import { SearchParams } from './validators'
import { listProductQueryConfig } from './query-config'

export const storeSearchRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/store/search',
    middlewares: [
      validateAndTransformQuery(SearchParams, listProductQueryConfig),
    ],
  },
]
