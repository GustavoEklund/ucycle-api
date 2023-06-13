export interface LoadCategory {
  load: (input: LoadCategory.Input) => Promise<LoadCategory.Output>
}

export namespace LoadCategory {
  export type Input = {
    id: string
  }
  export type Output =
    | {
        id: string
        name: string
      }
    | undefined
}
