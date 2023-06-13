import {
  Product,
  ProductCondition,
  ProductWarrantyDurationUnit,
  ProductWarrantyType,
} from '@/domain/entities/product'
import { LoadCategory, LoadUserAccount, SaveProduct } from '@/domain/contracts/repos'
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { CategoryNotFoundException } from '@/domain/entities/errors/category'
import { ProductMustHaveAtLeastOnePictureException } from '@/domain/entities/errors/product'
import { UserNotFoundError } from '@/domain/entities/errors/user'

export interface AddProduct {
  perform: (input: AddProduct.Input) => Promise<AddProduct.Output>
}

export class AddProductUseCase implements AddProduct {
  public constructor(
    private readonly userRepository: LoadUserAccount,
    private readonly categoryRepository: LoadCategory,
    private readonly productRepository: SaveProduct,
    private readonly cryptoGateway: UUIDGenerator,
    private readonly fileStorageGateway: UploadFile
  ) {}

  public async perform(input: AddProduct.Input): Promise<AddProduct.Output> {
    const user = await this.userRepository.load({ id: input.seller.id })
    if (user === undefined) return new UserNotFoundError(input.seller.id)
    const category = await this.categoryRepository.load({ id: input.category.id })
    if (category === undefined) return new CategoryNotFoundException(input.category.id)
    const pictureUrls: string[] = []
    for (const picture of input.pictures) {
      const url = await this.fileStorageGateway.upload({
        file: {
          buffer: picture.buffer,
          name: `${this.cryptoGateway.uuid()}.${picture.mimeType.split('/')[1]}`,
          mimeType: picture.mimeType,
        },
      })
      pictureUrls.push(url)
    }
    if (pictureUrls.length === 0) throw new ProductMustHaveAtLeastOnePictureException()
    const product = new Product({
      id: this.cryptoGateway.uuid(),
      sellerId: user.id,
      categoryId: category.id,
      title: input.title,
      description: input.description,
      pictureUrls,
      price: {
        totalInCents: input.priceInCents,
        discountInPercentage: 0,
      },
      condition: input.condition,
      warranty: {
        duration: {
          time: input.warranty.duration.time,
          unit: input.warranty.duration.unit,
        },
        type: input.warranty.type,
      },
    })
    await this.productRepository.save(product)
  }
}

export namespace AddProduct {
  export type Input = {
    seller: { id: string }
    category: { id: string }
    title: string
    description: string
    pictures: {
      buffer: Buffer
      mimeType: string
    }[]
    priceInCents: number
    condition: ProductCondition
    warranty: {
      duration: {
        time: number
        unit: ProductWarrantyDurationUnit
      }
      type: ProductWarrantyType
    }
  }
  export type Output = undefined | UserNotFoundError | CategoryNotFoundException
}
