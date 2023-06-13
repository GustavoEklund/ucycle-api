import { LoadProduct } from '@/domain/contracts/repos'
import { ProductNotFoundError } from '@/domain/entities/errors/product'

export interface LoadProductDetails {
  perform: (input: LoadProductDetails.Input) => Promise<LoadProductDetails.Output>
}

export class LoadProductDetailsUseCase implements LoadProductDetails {
  public constructor(private readonly productRepository: LoadProduct) {}

  public async perform(input: LoadProductDetails.Input): Promise<LoadProductDetails.Output> {
    const product = await this.productRepository.load({ id: input.id })
    if (product === undefined) return new ProductNotFoundError(input.id)
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      pictureUrls: product.pictureUrls,
      price: {
        totalInCents: product.price.totalInCents,
        discountInPercentage: product.price.discountInPercentage,
        discount: product.price.discount,
      },
    }
  }
}

export namespace LoadProductDetails {
  export type Input = {
    id: string
  }
  export type Output =
    | ProductNotFoundError
    | {
        id: string
        title: string
        description: string
        pictureUrls: string[]
        price: {
          totalInCents: number
          discountInPercentage: number
          discount: number
        }
      }
}
