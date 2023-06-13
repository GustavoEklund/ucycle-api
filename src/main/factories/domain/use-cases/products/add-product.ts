import { AddProduct, AddProductUseCase } from '@/domain/use-cases/products'
import {
  makePgCategoryRepo,
  makePgProductRepo,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'
import { makeAwsS3FileStorage, makeUuidHandler } from '@/main/factories/infra/gateways'

export const makeAddProductUseCase = (): AddProduct => {
  return new AddProductUseCase(
    makePgUserAccountRepo(),
    makePgCategoryRepo(),
    makePgProductRepo(),
    makeUuidHandler(),
    makeAwsS3FileStorage()
  )
}
