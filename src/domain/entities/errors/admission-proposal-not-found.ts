import { Exception } from '@/domain/entities/errors/exception'

export class AdmissionProposalNotFoundError extends Exception {
  public constructor(id: string) {
    super('AdmissionProposalNotFoundError', `admission proposal with id ${id} not found`)
  }
}
