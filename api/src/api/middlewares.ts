import { defineMiddlewares } from '@medusajs/medusa'
import { storeSearchRoutesMiddlewares } from './store/search/middlewares'

export default defineMiddlewares({
  routes: [...storeSearchRoutesMiddlewares],
})
