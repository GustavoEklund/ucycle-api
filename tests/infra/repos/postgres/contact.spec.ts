import { makeFakeDb, mockPgUser } from '@/tests/infra/repos/postgres/mocks'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgConnection } from '@/infra/repos/postgres/helpers'
import { PgUser } from '@/infra/repos/postgres/entities'
import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'
import { PgContactRepository } from '@/infra/repos/postgres'
import { mockContact, mockEmailContact, mockPhoneContact } from '@/tests/domain/mocks/entities'

describe('PgContactRepository', () => {
  let sut: PgContactRepository
  let connection: PgConnection
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb()
    backup = db.backup()
    pgUserRepo = connection.getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgContactRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('load', () => {
    it('should load email contact', async () => {
      const pgUser = await pgUserRepo.save(mockPgUser())
      const expectedContact = mockEmailContact({ userId: pgUser.id })
      await sut.save(expectedContact)

      const contact = await sut.load({ value: expectedContact.getFullPlainValue() })

      expect(contact).toEqual(expectedContact)
    })

    it('should load phone contact', async () => {
      const pgUser = await pgUserRepo.save(mockPgUser())
      const expectedContact = mockPhoneContact({ userId: pgUser.id })
      await sut.save(expectedContact)

      const contact = await sut.load({ value: expectedContact.getFullPlainValue() })

      expect(contact).toEqual(expectedContact)
    })

    it('should return undefined if email does not exist', async () => {
      const pgUser = await pgUserRepo.save(mockPgUser())
      const contact1 = mockEmailContact({ userId: pgUser.id })
      const contact2 = mockEmailContact({ userId: pgUser.id })
      await sut.save(contact1)
      await sut.save(contact2)

      const contact = await sut.load({
        value: mockEmailContact().getFullPlainValue(),
      })

      expect(contact).toBeUndefined()
    })

    it('should not load an soft deleted contact', async () => {
      const pgUser = await pgUserRepo.save(mockPgUser())
      const expectedContact = mockContact({ userId: pgUser.id })
      await sut.save(expectedContact)
      const contactBeforeDelete = await sut.load({ value: expectedContact.getFullPlainValue() })
      expect(contactBeforeDelete).toEqual(expectedContact)
      await sut.delete(expectedContact)

      const contact = await sut.load({ value: expectedContact.getFullPlainValue() })

      expect(contact).toBeUndefined()
    })
  })

  describe('delete', () => {
    it('should delete email contact', async () => {
      const pgUser = await pgUserRepo.save(mockPgUser())
      const contact = mockEmailContact({ userId: pgUser.id })
      await sut.save(contact)

      await sut.delete(contact)

      const deletedContact = await sut.load({ value: contact.getFullPlainValue() })
      expect(deletedContact).toBeUndefined()
    })

    it('should delete phone contact', async () => {
      const pgUser = await pgUserRepo.save(mockPgUser())
      const contact = mockPhoneContact({ userId: pgUser.id })
      await sut.save(contact)

      await sut.delete(contact)

      const deletedContact = await sut.load({ value: contact.getFullPlainValue() })
      expect(deletedContact).toBeUndefined()
    })

    it('should throw Error if contact cannot be found', async () => {
      const pgUser = await pgUserRepo.save(mockPgUser())
      const contact1 = mockEmailContact({ userId: pgUser.id })
      const contact2 = mockEmailContact({ userId: pgUser.id })
      await sut.save(contact1)
      await sut.save(contact2)
      const expectedError = new Error('could not find contact to delete')

      const promise = sut.delete(mockEmailContact())

      await expect(promise).rejects.toThrow(expectedError)
    })
  })
})
