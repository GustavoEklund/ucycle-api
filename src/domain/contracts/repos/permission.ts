import { PermissionStatus, UserPermission } from '@/domain/entities/permission'

export interface SaveUserPermission {
  save: (input: SaveUserPermission.Input) => Promise<SaveUserPermission.Output>
}

export namespace SaveUserPermission {
  export type Input = UserPermission
  export type Output = void
}

export interface LoadUserPermission {
  load: (input: LoadUserPermission.Input) => Promise<LoadUserPermission.Output>
}

export namespace LoadUserPermission {
  export type Input = {
    id?: string
    code?: string
    grantToUserId?: string
    status?: PermissionStatus
  }
  export type Output = UserPermission | undefined
}
