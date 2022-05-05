export interface SaveAdmissionProposal {
  save: (input: SaveAdmissionProposal.Input) => Promise<SaveAdmissionProposal.Output>
}

export namespace SaveAdmissionProposal {
  export type Input = {
    userId: string
    organizationId: string
  }
  export type Output = {
    id: string
  }
}

export interface LoadAdmissionProposals {
  load: (input: LoadAdmissionProposals.Input) => Promise<LoadAdmissionProposals.Output>
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
