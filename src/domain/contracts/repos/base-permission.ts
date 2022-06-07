export interface LoadBasePermission {
  load: (input: LoadBasePermission.Input) => Promise<LoadBasePermission.Output>
}

export namespace LoadBasePermission {
  export type Input = {
    code: string
  }
  export type Output = {
    id: string
    code: string
    read: boolean
    write: boolean
    owner: boolean
    name: string
    description: string
    moduleId: string
  }
}
