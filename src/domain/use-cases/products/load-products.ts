import { LoadProductsFromSearchQuery } from '@/domain/query'

export interface LoadProducts {
  perform: (input: LoadProducts.Input) => Promise<LoadProducts.Output>
}

export class LoadProductsUseCase implements LoadProducts {
  public constructor(private readonly productQuery: LoadProductsFromSearchQuery) {}

  public async perform(input: LoadProducts.Input): Promise<LoadProducts.Output> {
    return this.productQuery.loadProductsFromSearch(input)
  }
}

export namespace LoadProducts {
  export type Input = {
    userId?: string
    page: {
      number: number
      size: number
    }
    search?: {
      terms?: string
      relatedProductId?: string
    }
  }
  type ProductDTO = {
    id: string
    title: string
    picture: string
    price: {
      totalInCents: number
      discountInPercentage: number
    }
  }
  export type Output = ProductDTO[]
}
