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
