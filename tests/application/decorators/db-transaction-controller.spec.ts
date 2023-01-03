import { DbTransaction } from '@/application/contracts'
import { Controller } from '@/application/controllers'
import { DbTransactionControllerDecorator } from '@/application/decorators'

import { mock, MockProxy } from 'jest-mock-extended'
import { HttpResponse } from '@/application/helpers'

describe('DbTransactionControllerDecorator', () => {
  let db: MockProxy<DbTransaction>
  let decoratee: MockProxy<Controller>
  let sut: DbTransactionControllerDecorator

  beforeAll(() => {
    db = mock()
    decoratee = mock()
    decoratee.handle.mockResolvedValue({ statusCode: 204, data: null })
  })

  beforeEach(() => {
    sut = new DbTransactionControllerDecorator(decoratee, db)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })

  it('should execute decoratee', async () => {
    await sut.perform({ any: 'any' })

    expect(decoratee.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.handle).toHaveBeenCalledTimes(1)
  })

  it('should call commit and close transaction on success', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
    expect(db.rollback).not.toHaveBeenCalled()
    expect(db.commit).toHaveBeenCalledWith()
    expect(db.commit).toHaveBeenCalledTimes(1)
    expect(db.commit).toHaveBeenCalledAfter(db.openTransaction)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledAfter(db.commit)
  })

  it('should call rollback and close transaction on failure', async () => {
    decoratee.handle.mockRejectedValueOnce(new Error('perform_error'))

    sut.perform({ any: 'any' }).catch(() => {
      expect(db.openTransaction).toHaveBeenCalledWith()
      expect(db.openTransaction).toHaveBeenCalledTimes(1)
      expect(db.commit).not.toHaveBeenCalled()
      expect(db.rollback).toHaveBeenCalledWith()
      expect(db.rollback).toHaveBeenCalledTimes(1)
      expect(db.rollback).toHaveBeenCalledAfter(db.openTransaction)
      expect(db.closeTransaction).toHaveBeenCalledWith()
      expect(db.closeTransaction).toHaveBeenCalledTimes(1)
      expect(db.closeTransaction).toHaveBeenCalledAfter(db.rollback)
    })
  })

  it('should call rollback and close transaction if http response is a server error', async () => {
    decoratee.handle.mockResolvedValueOnce(HttpResponse.serverError([new Error('any_error')]))
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()

    expect(db.openTransaction).toHaveBeenCalledTimes(1)
    expect(db.commit).not.toHaveBeenCalled()
    expect(db.rollback).toHaveBeenCalledWith()
    expect(db.rollback).toHaveBeenCalledTimes(1)
    expect(db.rollback).toHaveBeenCalledAfter(db.openTransaction)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledAfter(db.rollback)
  })

  it('should return same result as decoratee on success', async () => {
    const httpResponse = await sut.perform({ any: 'any' })

    expect(httpResponse).toEqual({ statusCode: 204, data: null })
  })

  it('should rethrow if decoratee throws', async () => {
    const error = new Error('perform_error')
    decoratee.handle.mockRejectedValueOnce(error)

    const promise = sut.perform({ any: 'any' })

    await expect(promise).rejects.toThrow(error)
  })
})
