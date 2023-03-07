import { Product } from '@/domain/entities/product'
import faker from '@faker-js/faker'

export const mockProduct = (input?: {
  id?: string
  title?: string
  description?: string
  pictureUrl?: string
  price?: { totalInCents?: number; discountInPercentage?: number }
}): Product =>
  new Product({
    id: input?.id ?? faker.datatype.uuid(),
    title: input?.title ?? faker.commerce.productName(),
    description: input?.description ?? faker.lorem.sentence(),
    pictureUrl: input?.pictureUrl ?? faker.image.imageUrl(),
    price: {
      totalInCents: input?.price?.totalInCents ?? faker.datatype.number(),
      discountInPercentage:
        input?.price?.discountInPercentage ?? faker.datatype.number({ min: 0, max: 20 }),
    },
  })
