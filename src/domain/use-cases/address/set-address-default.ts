import { LoadAddress, LoadUserAccount, SaveAddress } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import {
  AddressDoesNotBelongToUserError,
  AddressNotFoundError,
} from '@/domain/entities/errors/address'

export interface SetAddressDefault {
  perform: (input: SetAddressDefault.Input) => Promise<SetAddressDefault.Output>
}

export class SetAddressDefaultUseCase implements SetAddressDefault {
  public constructor(
    private readonly userRepository: LoadUserAccount,
    private readonly addressRepository: LoadAddress & SaveAddress
  ) {}

  public async perform(input: SetAddressDefault.Input): Promise<SetAddressDefault.Output> {
    const user = await this.userRepository.load({ id: input.user.id })
    if (user === undefined) return new UserNotFoundError(input.user.id)
    for (const userAddress of user.addresses) {
      const existingAddress = await this.addressRepository.load({ id: userAddress.addressId })
      if (existingAddress !== undefined && existingAddress.isDefault) {
        existingAddress.setAsNotDefault()
        await this.addressRepository.save(existingAddress)
      }
    }
    const address = await this.addressRepository.load({ id: input.id })
    if (address === undefined) return new AddressNotFoundError(input.id)
    if (!address.belongsToUser(user.id))
      return new AddressDoesNotBelongToUserError(address.id, user.id)
    address.setAsDefault()
    await this.addressRepository.save(address)
  }
}

export namespace SetAddressDefault {
  export type Input = {
    id: string
    user: { id: string }
  }
  export type Output = undefined | UserNotFoundError | AddressDoesNotBelongToUserError
}
