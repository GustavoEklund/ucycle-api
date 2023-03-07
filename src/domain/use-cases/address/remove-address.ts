import { DeleteAddress, LoadAddress, LoadUserAccount } from '@/domain/contracts/repos'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import {
  AddressDoesNotBelongToUserError,
  AddressNotFoundError,
} from '@/domain/entities/errors/address'

export interface RemoveAddress {
  perform: (input: RemoveAddress.Input) => Promise<RemoveAddress.Output>
}

export class RemoveAddressUseCase implements RemoveAddress {
  public constructor(
    private readonly userRepository: LoadUserAccount,
    private readonly addressRepository: LoadAddress & DeleteAddress
  ) {}

  public async perform(input: RemoveAddress.Input): Promise<RemoveAddress.Output> {
    const user = await this.userRepository.load({ id: input.user.id })
    if (user === undefined) return new UserNotFoundError(input.user.id)
    const address = await this.addressRepository.load({ id: input.id })
    if (address === undefined) return new AddressNotFoundError(input.id)
    if (!address.belongsToUser(user.id))
      return new AddressDoesNotBelongToUserError(address.id, user.id)
    await this.addressRepository.delete(address)
  }
}

export namespace RemoveAddress {
  export type Input = {
    id: string
    user: { id: string }
  }
  export type Output = undefined | UserNotFoundError | AddressDoesNotBelongToUserError
}
