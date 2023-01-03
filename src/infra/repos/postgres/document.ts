import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadDocument } from '@/domain/contracts/repos'
import { PgDocument } from '@/infra/repos/postgres/entities'
import { Document } from '@/domain/value-objects'

export class PgDocumentRepository extends PgRepository implements LoadDocument {
  public async load({ number }: LoadDocument.Input): Promise<LoadDocument.Output> {
    const pgDocumentRepository = this.getRepository(PgDocument)
    const pgDocument = await pgDocumentRepository.findOne({
      where: { number },
    })
    if (pgDocument === undefined) return undefined
    return new Document(pgDocument.number)
  }
}
