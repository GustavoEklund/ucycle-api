import { LoadUserAccount } from '@/domain/contracts/repos/user-account'
import { PgRepository } from './repository'
import { PgUser } from '@/infra/repos/postgres/entities'
import { User, UserAccount, UserAccountStatus, UserProfile } from '@/domain/entities/user'
import { EmailType, PhoneType } from '@/domain/value-objects/contact'

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
      const userName = `${pgUser.firstName} ${pgUser.lastName}`
      const userProfile = new UserProfile({ socialName: undefined })
      userProfile.updatePicture({ name: userName, pictureUrl: pgUser.pictureUrl })
      return new User({
        id: pgUser.id,
        account: new UserAccount({
          name: userName,
          documents: (await pgUser.documents).map((document) => document.number),
          emails: (await pgUser.contacts)
            .filter((contact) => contact.type === 'EMAIL')
            .map((contact) => ({ value: contact.value, label: contact.label as EmailType })),
          phones: (await pgUser.contacts)
            .filter((contact) => contact.type === 'PHONE')
            .map((contact) => ({ value: contact.value, label: contact.label as PhoneType })),
          status: UserAccountStatus.active,
          verified: false,
        }),
        profile: userProfile,
      })
    }
  }
}
