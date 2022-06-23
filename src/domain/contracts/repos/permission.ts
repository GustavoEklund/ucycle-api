import { UserPermission } from '@/domain/entities/permission'

export interface SaveUserPermission {
  save: (input: SaveUserPermission.Input) => Promise<SaveUserPermission.Output>
}

export namespace SaveUserPermission {
  export type Input = UserPermission
  export type Output = void
}
