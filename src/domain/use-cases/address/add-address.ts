import { Address, AddressType } from '@/domain/entities/address'
import { LoadUserAccount, SaveAddress, SaveUserAccount } from '@/domain/contracts/repos'
import { UUIDGenerator } from '@/domain/contracts/gateways'
import { UserNotFoundError } from '@/domain/entities/errors/user'

export interface AddAddress {
  perform: (input: AddAddress.Input) => Promise<AddAddress.Output>
}

export class AddAddressUseCase implements AddAddress {
  public constructor(
    private readonly cryptoGateway: UUIDGenerator,
    private readonly addressRepository: SaveAddress,
    private readonly userRepository: LoadUserAccount & SaveUserAccount
  ) {}

  public async perform(input: AddAddress.Input): Promise<AddAddress.Output> {
    const user = await this.userRepository.load({ id: input.userId })
    if (user === undefined) return new UserNotFoundError(input.userId)
    const addressId = this.cryptoGateway.uuid()
    const address = new Address({
      id: addressId,
      userId: input.userId,
      phoneContactId: input.phoneContactId,
      street: input.street,
      landmark: input.landmark,
      zipCode: input.zipCode,
      type: input.type,
      city: input.city,
      country: input.country,
      state: input.state,
      buildingNumber: input.buildingNumber,
      neighbourhood: input.neighbourhood,
      isDefault: false,
    })
    await this.addressRepository.save(address)
    user.addAddress({ id: addressId })
    await this.userRepository.save(user)
    return { id: addressId }
  }
}

export namespace AddAddress {
  export type Input = {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    neighbourhood: string
    buildingNumber?: string
    landmark?: string
    phoneContactId: string
    type: AddressType
    userId: string
  }
  export type Output =
    | {
        id: string
      }
    | UserNotFoundError
}
