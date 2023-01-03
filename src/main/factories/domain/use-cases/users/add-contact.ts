import { AddContact, AddContactUseCase } from '@/domain/use-cases'
import { makeContactFactory } from '@/main/factories/domain/entities/contact'
import { makePgContactRepo } from '@/main/factories/infra/repos/postgres'
import { makePhoneContactAddedEventHandler } from '@/main/factories/infra/event-handlers'

export const makeAddContactUseCase = (): AddContact => {
  const addContactUseCase = new AddContactUseCase(makePgContactRepo(), makeContactFactory())
  addContactUseCase.subscribe(makePhoneContactAddedEventHandler())
  return addContactUseCase
}
