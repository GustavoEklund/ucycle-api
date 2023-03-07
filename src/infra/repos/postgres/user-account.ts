import { LoadUserAccount, SaveUserAccount } from '@/domain/contracts/repos/user-account'
import { PgRepository } from './repository'
import { PgContact, PgDocument, PgUser } from '@/infra/repos/postgres/entities'
import { User, UserAccount, UserAccountStatus, UserProfile } from '@/domain/entities/user'
import { EmailType, PhoneType } from '@/domain/entities/contact'

export class PgUserAccountRepository
  extends PgRepository
  implements LoadUserAccount, SaveUserAccount
{
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
            .map((contact) => ({
              value: contact.value,
              label: contact.label as EmailType,
              verified: contact.verified,
              isPrivate: contact.isPrivate,
            })),
          phones: (await pgUser.contacts)
            .filter((contact) => contact.type === 'PHONE')
            .map((contact) => ({
              value: contact.value,
              label: contact.label as PhoneType,
              verified: contact.verified,
              isPrivate: contact.isPrivate,
            })),
          status: UserAccountStatus.active,
          verified: false,
          userId: pgUser.id,
        }),
        profile: userProfile,
      })
    }
  }

  public async save(user: SaveUserAccount.Input): Promise<SaveUserAccount.Output> {
    const pgUserRepo = this.getRepository(PgUser)
    const pgDocumentRepo = this.getRepository(PgDocument)
    const pgContactRepo = this.getRepository(PgContact)
    const pgUser = await pgUserRepo.save({
      id: user.id,
      firstName: user.account.name.first,
      lastName: user.account.name.last,
      pictureUrl: user.profile.pictureUrl,
      initials: user.profile.initials,
    })
    for (const document of user.account.documents) {
      const pgDocument = await pgDocumentRepo.findOne({
        where: { number: document.number },
      })
      if (pgDocument !== undefined) continue
      await pgDocumentRepo.save({
        user: pgUser,
        type: document.type,
        number: document.number,
      })
    }
    for (const contact of user.account.contacts) {
      const pgContact = await pgContactRepo.findOne({
        where: { value: contact.getFullPlainValue() },
      })
      if (pgContact !== undefined) continue
      await pgContactRepo.save({
        user: pgUser,
        type: contact.type,
        value: contact.getFullPlainValue(),
        label: contact.label,
        isPrivate: contact.isPrivate,
      })
    }
  }
}
