import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadEmailTemplate } from '@/domain/contracts/repos'
import { PgEmailTemplate } from '@/infra/repos/postgres/entities/email-template'
import { EmailTemplate } from '@/domain/entities/email-template'

export class PgEmailTemplateRepository extends PgRepository implements LoadEmailTemplate {
  public async load(input: LoadEmailTemplate.Input): Promise<LoadEmailTemplate.Output> {
    const pgEmailTemplateRepo = this.getRepository(PgEmailTemplate)
    const pgEmailTemplate = await pgEmailTemplateRepo.findOne({ code: input.code })
    if (pgEmailTemplate === undefined) return undefined
    return new EmailTemplate({
      id: pgEmailTemplate.id,
      code: pgEmailTemplate.code,
      version: pgEmailTemplate.version,
      title: pgEmailTemplate.title,
      content: pgEmailTemplate.content,
      previousVersionId: pgEmailTemplate.previousVersion?.id,
      nextVersionId: pgEmailTemplate.nextVersion?.id,
    })
  }
}
