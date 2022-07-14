import { Document } from '@/domain/value-objects'

export interface LoadDocument {
  load: (params: LoadDocument.Input) => Promise<LoadDocument.Output>
}

export namespace LoadDocument {
  export type Input = {
    number: string
  }

  export type Output = Document | undefined
}
