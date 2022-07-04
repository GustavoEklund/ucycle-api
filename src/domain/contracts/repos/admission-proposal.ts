import { AdmissionProposal } from '@/domain/entities'

export interface SaveAdmissionProposal {
  save: (input: SaveAdmissionProposal.Input) => Promise<SaveAdmissionProposal.Output>
}

export namespace SaveAdmissionProposal {
  export type Input = {
    userId: string
    organizationId: string
    status: string
  }
  export type Output = {
    id: string
  }
}

export interface LoadAdmissionProposal {
  load: (input: LoadAdmissionProposal.Input) => Promise<LoadAdmissionProposal.Output>
}

namespace LoadAdmissionProposal {
  export type Input = {
    id: string
  }
  export type Output = AdmissionProposal
}

export interface LoadAdmissionProposals {
  loadAll: (input: LoadAdmissionProposals.Input) => Promise<LoadAdmissionProposals.Output>
}

export namespace LoadAdmissionProposals {
  export type Input = {
    userId?: string
    organizationId?: string
  }
  export type Output = {
    id: string
    user: {
      id: string
      name: string
    }
    organization: {
      id: string
      name: string
    }
  }[]
}
