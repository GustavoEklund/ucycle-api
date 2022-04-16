import { SaveUserAccount } from '@/domain/contracts/repos/user-account'
import { PgRepository } from './repository'
import { PgUser } from './entities/user'
import { PgDocument } from './entities/document'
import { PgContact } from './entities/contact'

export class PgUserAccountRepository extends PgRepository implements SaveUserAccount {
  public async save({
    id,
    firstName,
    lastName,
    firstAccess,
    contacts,
    documents,
  }: SaveUserAccount.Input): Promise<SaveUserAccount.Output> {
    const pgUserRepo = this.getRepository(PgUser)
    if (id !== undefined) {
      await pgUserRepo.update({ id }, { firstName, lastName, firstAccess })
      return { id }
    }
    let pgUser = pgUserRepo.create({
      firstName,
      lastName,
      firstAccess,
    })
    pgUser = await pgUserRepo.save(pgUser)
    const documentsWithUser = documents.map((document) => {
      const pgDocument = new PgDocument()
      pgDocument.user = Promise.resolve(pgUser)
      pgDocument.type = document.type
      pgDocument.number = document.number
      return pgDocument
    })
    pgUser.documents = Promise.resolve(documentsWithUser)
    const contactsWithUser = contacts.map((contact) => {
      const pgContact = new PgContact()
      pgContact.user = Promise.resolve(pgUser)
      pgContact.verified = contact.verified
      pgContact.type = contact.type
      pgContact.value = contact.value
      return pgContact
    })
    pgUser.contacts = Promise.resolve(contactsWithUser)
    await pgUserRepo.save(pgUser)
    return { id: pgUser.id }
  }
}
