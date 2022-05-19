import { LoadUserAccount } from '@/domain/contracts/repos/user-account'
import { PgRepository } from './repository'
import { PgUser } from '@/infra/repos/postgres/entities'

export class PgUserAccountRepository extends PgRepository implements LoadUserAccount {
  public async load({ id, email }: LoadUserAccount.Input): Promise<LoadUserAccount.Output> {
    const pgUserRepo = this.getRepository(PgUser)
    const pgUserQueryBuilder = pgUserRepo.createQueryBuilder('user')
    if (id !== undefined) pgUserQueryBuilder.andWhere('user.id = :id', { id })
    if (email !== undefined) {
      pgUserQueryBuilder
        .leftJoinAndSelect('user.contacts', 'contact')
        .andWhere('contact.value = :value', { value: email })
    }
    const pgUser = await pgUserQueryBuilder.getOne()
    if (pgUser !== undefined) {
      return {
        id: pgUser.id,
        firstName: pgUser.firstName,
        lastName: pgUser.lastName,
        documents: await pgUser.documents,
        contacts: await pgUser.contacts,
      }
    }
  }
}
