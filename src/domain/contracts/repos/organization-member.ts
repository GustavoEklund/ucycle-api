export interface LoadOrganizationMember {
  load: (input: LoadOrganizationMember.Input) => Promise<LoadOrganizationMember.Output>
}

export namespace LoadOrganizationMember {
  export type Input = {
    user: {
      id: string
    }
    organization: {
      id: string
    }
  }
  export type Output =
    | undefined
    | {
        id: string
        firstName: string
        lastName: string
        documents: { number: string }[]
        contacts: {
          value: string
          type: string
          label: string
          verified: boolean
        }[]
      }
}
