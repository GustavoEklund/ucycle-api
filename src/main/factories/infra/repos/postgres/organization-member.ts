import { PgOrganizationMemberRepository } from '@/infra/repos/postgres'

export const makePgOrganizationMemberRepo = (): PgOrganizationMemberRepository => {
  return new PgOrganizationMemberRepository()
}
