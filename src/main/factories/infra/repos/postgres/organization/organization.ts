import { PgOrganizationRepository } from '@/infra/repos/postgres'

export const makePgOrganizationRepo = (): PgOrganizationRepository => {
  return new PgOrganizationRepository()
}
