export const mockUser = () => ({
  firstName: 'any_name',
  lastName: 'any_last_name',
  firstAccess: false,
  documents: Promise.resolve([
    {
      type: 'CPF',
      number: 'any_document',
    },
  ]),
  contacts: Promise.resolve([
    {
      verified: true,
      type: 'EMAIL',
      value: { type: 'PRIMARY', address: 'existing_email' },
    },
  ]),
  organizations: Promise.resolve([
    {
      name: 'any_name',
    },
  ]),
})
