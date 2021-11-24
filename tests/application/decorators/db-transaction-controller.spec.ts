import { mock, MockProxy } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'

class DbTransactionControllerDecorator {
  constructor (
    private readonly decoratee: Controller,
    private readonly dbTransaction: DbTransaction
  ) {}

  async perform (httpRequest: any): Promise<void> {
    await this.dbTransaction.openTransaction()
    await this.decoratee.perform(httpRequest)
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>
}

describe('DbTransactionControllerDecorator', () => {
  let db: MockProxy<DbTransaction>
  let decoratee: MockProxy<Controller>
  let sut: DbTransactionControllerDecorator

  beforeAll(() => {
    db = mock()
    decoratee = mock()
  })

  beforeEach(() => {
    sut = new DbTransactionControllerDecorator(decoratee, db)
  })

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })

  it('should execute decoratee', async () => {
    await sut.perform({ any: 'any' })

    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledTimes(1)
  })
})
