import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadMyAddressesQuery } from '@/domain/query'

export class AddressQuery extends PgRepository implements LoadMyAddressesQuery {
  public async loadMyAddresses(
    input: LoadMyAddressesQuery.Input
  ): Promise<LoadMyAddressesQuery.Output> {
    const queryResult = await this.getEntityManager().query(
      `
        SELECT
          address.id,
          address.street,
          address.city,
          address.state,
          address.zip_code,
          address.country,
          address.neighbourhood,
          address.building_number,
          address.landmark,
          contact.id as phone_contact_id,
          contact.value as phone_contact_value
        FROM address
        LEFT OUTER JOIN contact on address.phone_contact_id = contact.id
        WHERE address.created_by = $1
    `,
      [input.user.id]
    )
    if (!Array.isArray(queryResult)) return []
    return queryResult.map((address) => {
      return {
        id: address.id,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zip_code,
        country: address.country,
        neighbourhood: address.neighbourhood,
        buildingNumber: address.building_number,
        landmark: address.landmark,
        phoneContact:
          address.phone_contact_id && address.phone_contact_value
            ? {
                id: address.phone_contact_id,
                value: address.phone_contact_value,
              }
            : undefined,
        type: address.type,
      }
    })
  }
}
