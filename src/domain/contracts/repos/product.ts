import { Product } from '@/domain/entities/product'

export interface LoadProduct {
  load: (input: LoadProduct.Input) => Promise<LoadProduct.Output>
}

export namespace LoadProduct {
  export type Input = {
    id: string
  }
  export type Output = undefined | Product
}

export interface SaveProduct {
  save: (product: Product) => Promise<void>
}
