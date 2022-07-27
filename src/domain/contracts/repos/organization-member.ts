import { OrganizationMember } from '@/domain/entities'

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
  export type Output = undefined | OrganizationMember
}
