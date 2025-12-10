import { Knex } from '@mikro-orm/knex'
import { SearchParams } from './validators'

export default class SearchEngine {
  #connection: Knex<any, any[]>
  #qb: Knex.QueryBuilder

  constructor(connection: Knex<any, any[]>) {
    this.#connection = connection
    this.#qb = connection.queryBuilder()
  }

  async searchProducts(params: SearchParams, select: string[]) {

    console.log('///////////////////params', params)
    this.buildBaseQuery(params.currency, select)
    this.applyFiltering(params)
    this.applySorting(params)
    this.applyPagination(params)

    return await this.#qb
  }

  private applySorting({ sort, q }: SearchParams) {
    if (sort === 'relevance') {
      if (q) {
        this.#qb.orderByRaw('ts_rank(searchable_content, plainto_tsquery(?)) DESC', [q])
      }
    } else {
      if (sort) {
        const sortingOrder = sort.startsWith('-') ? 'desc' : 'asc'
        const orderBy = sort.startsWith('-') ? sort.slice(1) : sort

        this.#qb.orderBy(orderBy, sortingOrder);
      }
    }
  }

  private applyPagination({ offset, limit }: SearchParams) {
    this.#qb.limit(limit).offset(offset);
  }

  private applyFiltering({
    q,
    collection,
    material,
    category,
    price,
  }: SearchParams) {
    if (q) {
      this.#qb.whereRaw('searchable_content @@ plainto_tsquery(?)', [q])
    }

    if (collection) {
      this.#qb.whereIn('product.collection_id', collection)
    }

    if (material) {
      this.#qb.whereIn('product.material', material)
    }

    if (category) {
      this.#qb.whereIn('id', function () {
        this.select('product_category_product.product_id')
          .from('product_category_product')
          .whereIn('product_category_id', category);
      })
    }

    if (price?.[0]) {
      this.#qb.where(
        this.#connection.raw('COALESCE(price_data.sale_price, price_data.regular_price)'),
        '>=',
        price[0]
      )
    }

    if (price?.[1]) {
      this.#qb.andWhere('price_data.max_price', '<=', price[1]);
    }
  }

  private buildBaseQuery(currencyCode: string, select: string[]) {
    this.#qb
      .with('price_data', (qb) => {
        qb.select(
          'product_variant.product_id',
          this.#connection.raw(
            "MIN(CASE WHEN price_list.type = 'sale' THEN price.amount END) AS sale_price"
          ),
          this.#connection.raw(
            'MIN(CASE WHEN price.price_list_id IS NULL THEN price.amount END) AS regular_price'
          ),
          this.#connection.raw('MAX(price.amount) AS max_price')
        )
          .from('product_variant')
          .innerJoin(
            'product_variant_price_set',
            'product_variant_price_set.variant_id',
            'product_variant.id'
          )
          .innerJoin('price_set', 'price_set.id', 'product_variant_price_set.price_set_id')
          .innerJoin('price', function () {
            this.on('price.price_set_id', '=', 'price_set.id').andOnIn('price.currency_code', [
              currencyCode
            ]);
          })
          .leftJoin('price_list', 'price_list.id', 'price.price_list_id')
          .whereNull('product_variant.deleted_at')
          .whereNull('product_variant_price_set.deleted_at')
          .whereNull('price_set.deleted_at')
          .whereNull('price.deleted_at')
          .groupBy('product_variant.product_id');
      })
      .select(
        ...select.map((sel) => `product.${sel}`),
        'price_data.regular_price',
        'price_data.sale_price',
        this.#connection.raw(
          'COALESCE(price_data.sale_price, price_data.regular_price) AS calculated_price'
        ),
        this.#connection.raw('COUNT(*) OVER() AS total_count')
      )
      .from('product')
      .leftJoin('price_data', 'price_data.product_id', 'product.id')
      .where('product.status', '=', 'published')
      .whereNull('product.deleted_at');
  }
}