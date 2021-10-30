import { app } from '@/main/config/app'
import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'

import { getConnection } from 'typeorm'
import { IBackup } from 'pg-mem'
import request from 'supertest'

describe('User Routes', () => {
  describe('DELETE /users/profile/picture', () => {
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
      backup = db.backup()
    })

    beforeEach(() => {
      backup.restore()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    it('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/users/profile/picture')

      expect(status).toBe(403)
    })
  })
})
