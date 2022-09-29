export interface LoadProductsFromSearchQuery {
  loadProductsFromSearch: (
    input: LoadProductsFromSearchQuery.Input
  ) => Promise<LoadProductsFromSearchQuery.Output>
}

export namespace LoadProductsFromSearchQuery {
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
