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
    email: string
  }

  export type Output =
    | undefined
    | {
        id: string
        name?: string
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

export interface SaveFacebookAccount {
  saveWithFacebook: (params: SaveFacebookAccount.Input) => Promise<SaveFacebookAccount.Output>
}

export namespace SaveFacebookAccount {
  export type Input = {
    id?: string
    facebookId: string
    name: string
    email: string
  }

  export type Output = {
    id: string
  }
}
