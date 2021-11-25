import { PgRepository } from '@/infra/repos/postgres/repository'

class PgProductRepository extends PgRepository {

}

describe('PgProductRepository', () => {
  it('should extend PgRepository', () => {
    const sut = new PgProductRepository()
    expect(sut).toBeInstanceOf(PgRepository)
  })
})
