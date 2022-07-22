import { Contact } from '@/domain/value-objects/contact'

export interface LoadContact {
  load: (params: LoadContact.Input) => Promise<LoadContact.Output>
}

export namespace LoadContact {
  export type Input = {
    value: string
  }

  export type Output = Contact | undefined
}
