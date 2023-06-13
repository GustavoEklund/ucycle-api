export interface LoadProductCategoriesFromSearchQuery {
  loadFromSearch: (
    input: LoadProductCategoriesFromSearchQuery.Input
  ) => Promise<LoadProductCategoriesFromSearchQuery.Output>
}

export namespace LoadProductCategoriesFromSearchQuery {
  export type Input = {
    page: {
      number: number
      size: number
    }
  }
  type ProductCategoryDTO = {
    id: string
    name: string
  }
  export type Output = ProductCategoryDTO[]
}
