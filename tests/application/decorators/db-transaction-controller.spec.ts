import { mock, MockProxy } from 'jest-mock-extended'

class DbTransactionControllerDecorator {
  constructor (private readonly dbTransaction: DbTransaction) {}

  async perform (httpRequest: any): Promise<void> {
    await this.dbTransaction.openTransaction()
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>
}

describe('DbTransactionControllerDecorator', () => {
  let db: MockProxy<DbTransaction>
  let sut: DbTransactionControllerDecorator

  beforeAll(() => {
    db = mock<DbTransaction>()
  })

  beforeEach(() => {
    sut = new DbTransactionControllerDecorator(db)
  })

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })
})
