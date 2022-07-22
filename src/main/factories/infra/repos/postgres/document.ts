import { PgDocumentRepository } from '@/infra/repos/postgres'

export const makePgDocumentRepo = (): PgDocumentRepository => {
  return new PgDocumentRepository()
}
