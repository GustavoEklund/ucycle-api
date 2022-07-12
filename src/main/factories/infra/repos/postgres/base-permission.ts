import { PgBasePermissionRepository } from '@/infra/repos/postgres'

export const makePgBasePermissionRepo = (): PgBasePermissionRepository => {
  return new PgBasePermissionRepository()
}
