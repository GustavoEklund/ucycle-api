import { GrantPermission, GrantPermissionUseCase } from '@/domain/use-cases/permissions'
import {
  makePgBasePermissionRepo,
  makePgUserAccountRepo,
  makePgUserPermissionRepo,
} from '@/main/factories/infra/repos/postgres'
import { makeUuidHandler } from '@/main/factories/infra/gateways'

export const makeGrantPermissionUseCase = (): GrantPermission => {
  return new GrantPermissionUseCase(
    makePgUserAccountRepo(),
    makePgBasePermissionRepo(),
    makePgUserPermissionRepo(),
    makeUuidHandler()
  )
}
