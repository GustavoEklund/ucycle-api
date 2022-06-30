import { Controller, RevokePermissionController } from '@/application/controllers'
import { makeRevokePermissionUseCase } from '@/main/factories/domain/use-cases/permissions'

export const makeRevokePermissionController = (): Controller => {
  return new RevokePermissionController(makeRevokePermissionUseCase())
}
