import { Controller, GrantPermissionController } from '@/application/controllers'
import { makeGrantPermissionUseCase } from '@/main/factories/domain/use-cases/permissions'

export const makeGrantPermissionController = (): Controller => {
  return new GrantPermissionController(makeGrantPermissionUseCase())
}
