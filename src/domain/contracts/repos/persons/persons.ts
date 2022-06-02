export interface LoadPersons {
  load: (params: LoadPersons.Input) => Promise<LoadPersons.Output>
}

export namespace LoadPersons {
  export type Input = {
    id: string
  }
  export type Output =
    | undefined
    | {
        id: string
      }
}

export interface SavePersons {
  save: (params: SavePersons.Input) => Promise<SavePersons.Output>
}

export namespace SavePersons {
  export type Input = {
    firstName: string
    lastName: string

    // document: Address;
    // contact: number;

    birthDate?: string
    professional?: string
    marriedStatus?: string

    specialNeeds: boolean
    specialNeedsDescription?: string
  }

  export type Output = {
    id: string
  }
}
