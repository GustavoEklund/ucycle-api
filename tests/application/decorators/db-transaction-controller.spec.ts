import { mock, MockProxy } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'

class DbTransactionControllerDecorator {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) {}

  async perform (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
    try {
      await this.decoratee.perform(httpRequest)
      await this.db.commit()
      await this.db.closeTransaction()
    } catch {
      await this.db.rollback()
      await this.db.closeTransaction()
    }
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commit: () => Promise<void>
  rollback: () => Promise<void>
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

  it('should call commit and close transaction on success', async () => {
    await sut.perform({ any: 'any' })

    expect(db.rollback).not.toHaveBeenCalled()
    expect(db.commit).toHaveBeenCalledWith()
    expect(db.commit).toHaveBeenCalledTimes(1)
    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })

  it('should call rollback and close transaction on failure', async () => {
    decoratee.perform.mockRejectedValueOnce(new Error('perform_error'))

    await sut.perform({ any: 'any' })

    expect(db.commit).not.toHaveBeenCalled()
    expect(db.rollback).toHaveBeenCalledWith()
    expect(db.rollback).toHaveBeenCalledTimes(1)
    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })
})
