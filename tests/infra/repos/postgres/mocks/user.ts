import { SaveUserAccount } from '@/domain/contracts/repos'

export const mockUser = (): SaveUserAccount.Input => ({
  firstName: 'any_name',
  lastName: 'any_last_name',
  firstAccess: false,
  documents: [
    {
      type: 'CPF',
      number: 'any_document',
    },
  ],
  contacts: [
    {
      verified: true,
      type: 'EMAIL',
      value: { type: 'PRIMARY', address: 'existing_email' },
    },
  ],
})
