type Document = {
  number: string
  type: string
}
type Email = {
  address: string
  type: string
}
type Phone = {
  number: string
  countryCode: string
  areaCode: string
  type: string
}
type Contact = {
  type: string
  verified: boolean
  value: Email | Phone
}

export interface LoadUserAccount {
  load: (params: LoadUserAccount.Input) => Promise<LoadUserAccount.Output>
}

export namespace LoadUserAccount {
  export type Input = {
    id?: string
    email?: string
  }

  export type Output =
    | undefined
    | {
        id: string
        name?: string
        documents: { number: string }[]
        contacts: {
          value: string
          type: string
          label: string
          verified: boolean
        }[]
      }
}

export interface SaveUserAccount {
  save: (params: SaveUserAccount.Input) => Promise<SaveUserAccount.Output>
}

export namespace SaveUserAccount {
  export type Input = {
    id?: string
    firstName: string
    lastName: string
    firstAccess: boolean
    documents: Document[]
    contacts: Contact[]
  }
  export type Output = {
    id: string
  }
}
