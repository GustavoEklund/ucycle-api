import { RevokePermission, RevokePermissionUseCase } from '@/domain/use-cases/permissions'
import {
  makePgUserAccountRepo,
  makePgUserPermissionRepo,
} from '@/main/factories/infra/repos/postgres'

export const makeRevokePermissionUseCase = (): RevokePermission => {
  return new RevokePermissionUseCase(makePgUserAccountRepo(), makePgUserPermissionRepo())
}
