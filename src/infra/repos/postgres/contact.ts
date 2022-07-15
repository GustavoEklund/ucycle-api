import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadContact } from '@/domain/contracts/repos'
import { PgContact } from '@/infra/repos/postgres/entities'
import { Email, EmailType, Phone, PhoneType } from '@/domain/value-objects/contact'

export class PgContactRepository extends PgRepository implements LoadContact {
  public async load({ value }: LoadContact.Input): Promise<LoadContact.Output> {
    const pgContactRepository = this.getRepository(PgContact)

    const pgContact = await pgContactRepository.findOne({
      where: { value },
    })

    if (pgContact === undefined) return undefined

    if (pgContact.type === 'EMAIL') return new Email(pgContact.value, pgContact.label as EmailType)

    return new Phone(pgContact.value, pgContact.label as PhoneType)
  }
}
