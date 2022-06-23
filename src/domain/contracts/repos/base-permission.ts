import { BasePermission } from '@/domain/entities/permission'

export interface LoadBasePermission {
  load: (input: LoadBasePermission.Input) => Promise<LoadBasePermission.Output>
}

export namespace LoadBasePermission {
  export type Input = {
    code: string
  }
  export type Output = undefined | BasePermission
}
