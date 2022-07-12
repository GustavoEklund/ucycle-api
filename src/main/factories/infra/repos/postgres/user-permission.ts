import { PgUserPermissionRepository } from '@/infra/repos/postgres'

export const makePgUserPermissionRepo = (): PgUserPermissionRepository => {
  return new PgUserPermissionRepository()
}
