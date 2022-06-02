import { PgAdmissionProposalRepository } from '@/infra/repos/postgres'

export const makePgAdmissionProposalRepo = (): PgAdmissionProposalRepository => {
  return new PgAdmissionProposalRepository()
}
