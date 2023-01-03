import { ContactFactory } from '@/domain/entities/contact'

export const makeContactFactory = (): ContactFactory => {
  return new ContactFactory()
}
