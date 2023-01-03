import { PgEmailTemplateRepository } from '@/infra/repos/postgres'

export const makePgEmailTemplateRepo = (): PgEmailTemplateRepository => {
  return new PgEmailTemplateRepository()
}
