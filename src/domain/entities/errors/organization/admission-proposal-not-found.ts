import { DomainException } from '@/domain/entities/errors'

export class AdmissionProposalNotFoundError extends DomainException {
  public constructor(id: string) {
    super('AdmissionProposalNotFoundError', `admission proposal with id ${id} not found`)
  }
}
