import jwt from 'jsonwebtoken'
import { JwtTokenHandler } from '@/infra/crypto'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generateToken', () => {
    let key: string
    let expirationInMs: number
    let token: string

    beforeAll(() => {
      key = 'any_token'
      token = 'any_token'
      expirationInMs = 1000
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call sign with correct params', async () => {
      await sut.generateToken({ key, expirationInMs })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    })

    it('should return a token', async () => {
      const generatedToken = await sut.generateToken({ key, expirationInMs })

      expect(generatedToken).toBe(token)
    })

    it('should rethrow if sign throws', async () => {
      const error = new Error('token_error')
      fakeJwt.sign.mockImplementationOnce(() => { throw error })

      const promise = sut.generateToken({ key, expirationInMs })

      await expect(promise).rejects.toThrow(error)
    })
  })
  //
  // describe('validateToken', () => {
  //   let key: string
  //   let expirationInMs: number
  //   let token: string
  //
  //   beforeAll(() => {
  //     key = 'any_token'
  //     token = 'any_token'
  //     expirationInMs = 1000
  //     fakeJwt.verify.mockImplementation(() => token)
  //   })
  //
  //   it('should call verify with correct params', async () => {
  //     await sut.validateToken({ key: 'any_key', expirationInMs })
  //
  //     expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
  //   })
  // })
})
