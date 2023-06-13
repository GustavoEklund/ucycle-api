import { Controller } from '@/application/controllers'
import { makeLogErrorControllerDecorator } from '@/main/factories/application/decorators'
import { LoadProductCategoriesController } from '@/application/controllers/product-category'
import { makeProductCategoryQuery } from '@/main/factories/infra/query/postgres/product-category'

export const makeLoadProductCategoriesController = (): Controller => {
  const controller = new LoadProductCategoriesController(makeProductCategoryQuery())
  return makeLogErrorControllerDecorator(controller)
}
