import { LoadProductDetailsUseCase } from '@/domain/use-cases/products'
import { makePgProductRepo } from '@/main/factories/infra/repos/postgres'

export const makeLoadProductDetailsUseCase = () => {
  return new LoadProductDetailsUseCase(makePgProductRepo())
}
