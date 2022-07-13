import { User } from '@/domain/entities/user'

export interface LoadUserAccount {
  load: (params: LoadUserAccount.Input) => Promise<LoadUserAccount.Output>
}

export namespace LoadUserAccount {
  export type Input = {
    id?: string
    email?: string
  }

  export type Output = User | undefined
}

export interface SaveUserAccount {
  save: (params: SaveUserAccount.Input) => Promise<SaveUserAccount.Output>
}

export namespace SaveUserAccount {
  export type Input = User
  export type Output = void
}
