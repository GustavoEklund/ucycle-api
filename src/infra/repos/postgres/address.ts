import { PgRepository } from '@/infra/repos/postgres/repository'
import { DeleteAddress, LoadAddress, SaveAddress } from '@/domain/contracts/repos'
import { Address, AddressType } from '@/domain/entities/address'
import { PgAddress, PgContact, PgUser } from '@/infra/repos/postgres/entities'

export class PgAddressRepository
  extends PgRepository
  implements SaveAddress, LoadAddress, DeleteAddress
{
  public async delete(input: Address): Promise<void> {
    await this.getRepository(PgAddress).softDelete({ id: input.id })
  }

  public async load(input: LoadAddress.Input): Promise<LoadAddress.Output> {
    const pgAddress = await this.getRepository(PgAddress).findOne(input.id, {
      relations: ['createdBy', 'phoneContact'],
    })
    if (pgAddress === undefined) return undefined
    return new Address({
      id: pgAddress.id,
      street: pgAddress.street,
      buildingNumber: pgAddress.buildingNumber,
      neighbourhood: pgAddress.neighbourhood,
      city: pgAddress.city,
      state: pgAddress.state,
      country: pgAddress.country,
      zipCode: pgAddress.zipCode,
      landmark: pgAddress.landmark,
      phoneContactId: pgAddress.phoneContact?.id,
      isDefault: pgAddress.isDefault,
      type: pgAddress.type as AddressType,
      userId: pgAddress.createdBy.id,
    })
  }

  public async save(input: Address): Promise<void> {
    const pgUser = await this.getRepository(PgUser).findOneOrFail(input.userId)
    let pgPhoneContact: PgContact | undefined
    if (input.phoneContact !== undefined) {
      pgPhoneContact = await this.getRepository(PgContact).findOneOrFail(
        input.phoneContact.phoneContactId
      )
    }
    await this.getRepository(PgAddress).save({
      id: input.id,
      street: input.street,
      buildingNumber: input.buildingNumber,
      neighbourhood: input.neighbourhood,
      city: input.city,
      state: input.state,
      country: input.country,
      zipCode: input.zipCode,
      landmark: input.landmark,
      isDefault: input.isDefault,
      type: input.type,
      createdBy: pgUser,
      phoneContact: pgPhoneContact,
    })
  }
}
