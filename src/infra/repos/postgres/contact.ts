import { PgRepository } from '@/infra/repos/postgres/repository'
import { DeleteContact, LoadContact, SaveContact } from '@/domain/contracts/repos'
import { PgContact, PgUser } from '@/infra/repos/postgres/entities'
import { Email, EmailType, Phone, PhoneType } from '@/domain/entities/contact'

export class PgContactRepository
  extends PgRepository
  implements LoadContact, SaveContact, DeleteContact
{
  public async save(input: SaveContact.Input): Promise<SaveContact.Output> {
    const pgUserAccountRepository = this.getRepository(PgUser)
    const pgUser = await pgUserAccountRepository.findOneOrFail(input.userId)
    const pgContactRepository = this.getRepository(PgContact)
    await pgContactRepository.save({
      value: input.getFullPlainValue(),
      type: input.type,
      label: input.label,
      isPrivate: input.isPrivate,
      verified: input.verified,
      user: pgUser,
    })
  }

  public async load({ value }: LoadContact.Input): Promise<LoadContact.Output> {
    const pgContactRepository = this.getRepository(PgContact)
    const pgContact = await pgContactRepository.findOne({
      where: { value },
      relations: ['user'],
    })
    if (pgContact === undefined) return undefined
    if (pgContact.type === 'EMAIL')
      return new Email({
        value: pgContact.value,
        label: pgContact.label as EmailType,
        isPrivate: pgContact.isPrivate,
        verified: pgContact.verified,
        userId: pgContact.user.id,
      })
    return new Phone({
      value: pgContact.value,
      label: pgContact.label as PhoneType,
      isPrivate: pgContact.isPrivate,
      verified: pgContact.verified,
      userId: pgContact.user.id,
    })
  }

  public async delete(input: DeleteContact.Input): Promise<DeleteContact.Output> {
    const pgContactRepository = this.getRepository(PgContact)
    const pgContact = await pgContactRepository.findOne({
      where: { value: input.getFullPlainValue() },
    })
    if (pgContact === undefined) throw new Error('could not find contact to delete')
    await pgContactRepository.softDelete(pgContact)
  }
}
