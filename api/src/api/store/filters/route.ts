import { MedusaRequest, MedusaResponse } from '@medusajs/framework'

/**
 * let storefront get product filter options
 * @param req
 * @param res
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const knex = req.scope.resolve('__pg_connection__')

  const [collection, category, material] = await Promise.all([
    knex('product_collection')
      .select('id', 'title as value')
      .whereNull('deleted_at'),
    knex('product_category')
      .select('id', 'name as value')
      .whereNull('deleted_at'),
    knex('product')
      .distinct('material')
      .whereNotNull('material')
      .whereNull('deleted_at')
      .pluck('material'),
  ])

  res.json({
    collection,
    category,
    material: material.map((v) => ({ id: v, value: v })),
  })
}
