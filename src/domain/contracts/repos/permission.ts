export interface SavePermission {
  save: (input: SavePermission.Input) => Promise<SavePermission.Output>
}

export namespace SavePermission {
  export type Input = {
    grantById: string
    grantToId: string
    code: string
    read: boolean
    write: boolean
    owner: boolean
    status: string
    moduleId: string
    resourceId: string
  }
  export type Output = {
    id: string
  }
}
