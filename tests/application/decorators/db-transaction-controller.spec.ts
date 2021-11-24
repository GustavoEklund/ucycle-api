import { mock } from 'jest-mock-extended'

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
  it('should open transaction', async () => {
    const db = mock<DbTransaction>()
    const sut = new DbTransactionControllerDecorator(db)

    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })
})
