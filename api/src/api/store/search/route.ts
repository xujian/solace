import { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { SearchParams } from './validators'
import SearchEngine from './engine'

export const GET = async (
  req: MedusaRequest<SearchParams>,
  res: MedusaResponse
) => {
  const { limit, offset } = req.validatedQuery as SearchParams;

  const knex = req.scope.resolve('__pg_connection__');

  const engine = new SearchEngine(knex);

  const products = await engine.searchProducts(
    req.validatedQuery as SearchParams,
    req.listConfig.select || []
  );

  res.json({
    products: products.map(({ total_count, ...other }) => other),
    count: Number(products[0]?.total_count ?? 0),
    limit,
    offset
  })
}
