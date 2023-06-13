import { LoadMyOrdersQuery, LoadMySalesQuery } from '@/domain/query'
import { PgRepository } from '@/infra/repos/postgres/repository'

export class OrderTypeOrmQuery extends PgRepository implements LoadMyOrdersQuery, LoadMySalesQuery {
  public async loadMyOrders(input: LoadMyOrdersQuery.Input): Promise<LoadMyOrdersQuery.Output> {
    const query = `
      SELECT
        "order".code,
        "order".created_at              AS "createdAt",
        "order".updated_at              AS "updatedAt",
        "order".status,
        "order".total_in_cents          AS "totalInCents",
        "order".id                      AS "shipping.address.id",
        "order".shipping_price_in_cents AS "shipping.priceInCents",
        "order".estimated_delivery_date AS "shipping.estimatedDeliveryDate",
        address.id                      AS "shipping.address.id",
        address.street                  AS "shipping.address.street",
        address.city                    AS "shipping.address.city",
        address.state                   AS "shipping.address.state",
        address.zip_code                AS "shipping.address.zipCode",
        address.country                 AS "shipping.address.country",
        address.neighbourhood           AS "shipping.address.neighbourhood",
        address.building_number         AS "shipping.address.buildingNumber",
        address.landmark                AS "shipping.address.landmark",
        address.type                    AS "shipping.address.type",
        phone_contact.id                AS "shipping.address.phoneContact.id",
        phone_contact.value             AS "shipping.address.phoneContact.value",
        JSON_AGG(
           JSON_BUILD_OBJECT(
             'id', order_item.id,
             'title', order_item.title,
             'pictureUrl', order_item.picture_url,
             'priceInCents', order_item.price_in_cents,
             'amount', order_item.amount
           )
        ) as items
      FROM "order"
        INNER JOIN address ON address.id = "order".shipping_address_id
        LEFT JOIN contact phone_contact ON phone_contact.id = address.phone_contact_id
        JOIN order_item ON order_item.order_id = "order".id
      WHERE "order".user_id = $1
      GROUP BY "order".id, "order".created_at, address.id, phone_contact.id
      ORDER BY "order".created_at DESC
      LIMIT $2 OFFSET $3
    `
    const queryResult = await this.getEntityManager().query(query, [
      input.user.id,
      input.page.size,
      (input.page.number - 1) * input.page.size,
    ])
    return this.mapQueryResultToOrders(queryResult)
  }

  public async loadMySales(input: LoadMySalesQuery.Input): Promise<LoadMySalesQuery.Output> {
    const query = `
      SELECT
        "order".code,
        "order".created_at              AS "createdAt",
        "order".updated_at              AS "updatedAt",
        "order".status,
        "order".total_in_cents          AS "totalInCents",
        "order".id                      AS "shipping.address.id",
        "order".shipping_price_in_cents AS "shipping.priceInCents",
        "order".estimated_delivery_date AS "shipping.estimatedDeliveryDate",
        address.id                      AS "shipping.address.id",
        address.street                  AS "shipping.address.street",
        address.city                    AS "shipping.address.city",
        address.state                   AS "shipping.address.state",
        address.zip_code                AS "shipping.address.zipCode",
        address.country                 AS "shipping.address.country",
        address.neighbourhood           AS "shipping.address.neighbourhood",
        address.building_number         AS "shipping.address.buildingNumber",
        address.landmark                AS "shipping.address.landmark",
        address.type                    AS "shipping.address.type",
        phone_contact.id                AS "shipping.address.phoneContact.id",
        phone_contact.value             AS "shipping.address.phoneContact.value",
        JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', order_item.id,
              'title', order_item.title,
              'pictureUrl', order_item.picture_url,
              'priceInCents', order_item.price_in_cents,
              'amount', order_item.amount
            )
        ) as items
      FROM "order"
        INNER JOIN address ON address.id = "order".shipping_address_id
        LEFT JOIN contact phone_contact ON phone_contact.id = address.phone_contact_id
        JOIN order_item ON order_item.order_id = "order".id
        JOIN product ON product.id = order_item.product_id
      WHERE product.created_by = $1
      GROUP BY "order".id, "order".created_at, address.id, phone_contact.id
      ORDER BY "order".created_at DESC
      LIMIT $2 OFFSET $3
    `
    const queryResult = await this.getEntityManager().query(query, [
      input.seller.id,
      input.page.size,
      (input.page.number - 1) * input.page.size,
    ])
    return this.mapQueryResultToOrders(queryResult)
  }

  private mapQueryResultToOrders(
    queryResult: any
  ): LoadMySalesQuery.Output | LoadMyOrdersQuery.Output {
    if (queryResult.length === 0) {
      return []
    }
    return queryResult.map((order: any) => ({
      code: order.code,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      status: order.status,
      totalInCents: order.totalInCents,
      shipping: {
        id: order['shipping.id'],
        priceInCents: order['shipping.priceInCents'],
        estimatedDeliveryDate: new Date(order['shipping.estimatedDeliveryDate']),
        address: {
          id: order['shipping.address.id'],
          street: order['shipping.address.street'],
          city: order['shipping.address.city'],
          state: order['shipping.address.state'],
          zipCode: order['shipping.address.zipCode'],
          country: order['shipping.address.country'],
          neighbourhood: order['shipping.address.neighbourhood'],
          buildingNumber: order['shipping.address.buildingNumber'],
          landmark: order['shipping.address.landmark'],
          type: order['shipping.address.type'],
          phoneContact: order['shipping.address.phoneContact']
            ? {
                id: order['shipping.address.phoneContact.id'],
                value: order['shipping.address.phoneContact.value'],
              }
            : undefined,
        },
      },
      items: order.items.map((product: any) => ({
        id: product.id,
        title: product.title,
        pictureUrl: product.pictureUrl,
        priceInCents: product.priceInCents,
        amount: product.amount,
      })),
    }))
  }
}
