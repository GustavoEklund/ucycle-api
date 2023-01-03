import { Contact } from '@/domain/entities/contact'

export interface LoadContact {
  load: (params: LoadContact.Input) => Promise<LoadContact.Output>
}

export namespace LoadContact {
  export type Input = {
    id?: string
    value?: string
  }

  export type Output = Contact | undefined
}

export interface SaveContact {
  save: (input: SaveContact.Input) => Promise<SaveContact.Output>
}

export namespace SaveContact {
  export type Input = Contact
  export type Output = void
}

export interface DeleteContact {
  delete: (input: DeleteContact.Input) => Promise<DeleteContact.Output>
}

export namespace DeleteContact {
  export type Input = Contact
  export type Output = void
}
