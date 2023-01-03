import { HttpPostClient, HttpPutClient } from '@/infra/gateways'

import { mock, MockProxy } from 'jest-mock-extended'
import { KeycloakApi } from '@/infra/gateways/keycloak-api'

describe('KeycloakApi', () => {
  let baseUrl: string
  let realm: string
  let clientId: string
  let clientSecret: string
  let sut: KeycloakApi
  let httpClientSpy: MockProxy<HttpPostClient & HttpPutClient>

  beforeAll(() => {
    baseUrl = 'http://localhost:8080/auth'
    realm = 'any_realm'
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    httpClientSpy = mock()
  })

  beforeEach(() => {
    httpClientSpy.post
      .mockResolvedValueOnce({
        data: {
          access_token: 'any_access_token',
          expires_in: 60,
          refresh_expires_in: 0,
          token_type: 'Bearer',
          'not-before-policy': 0,
          scope: 'profile email',
        },
        statusCode: 200,
        headers: {},
      })
      .mockResolvedValueOnce({
        data: undefined,
        statusCode: 201,
        headers: {
          location: 'http://localhost:8080/auth/admin/realms/any_realm/users/any_user_id',
        },
      })
    httpClientSpy.put.mockResolvedValueOnce({
      data: undefined,
      statusCode: 204,
      headers: {},
    })
    sut = new KeycloakApi(httpClientSpy, baseUrl, realm, clientId, clientSecret)
  })

  it('should get auth token', async () => {
    await sut.saveWithKeycloak({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      firstName: 'any_first_name',
      lastName: 'any_last_name',
    })

    expect(httpClientSpy.post).toHaveBeenCalledTimes(2)
    expect(httpClientSpy.post.mock.calls[0][0]).toEqual({
      url: 'http://localhost:8080/auth/realms/any_realm/protocol/openid-connect/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'any_client_id',
        client_secret: 'any_client_secret',
      }),
    })
  })

  it('should create a new user account', async () => {
    await sut.saveWithKeycloak({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      firstName: 'any_first_name',
      lastName: 'any_last_name',
    })

    expect(httpClientSpy.post.mock.calls[1][0]).toEqual({
      url: 'http://localhost:8080/auth/admin/realms/any_realm/users',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer any_access_token',
      },
      body: {
        id: 'any_id',
        enabled: true,
        email: 'any_email',
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        credentials: [
          {
            type: 'password',
            value: 'any_password',
            temporary: false,
          },
        ],
        username: 'any_email',
        requiredActions: ['VERIFY_EMAIL'],
      },
    })
  })

  it('should throw if http status is not 201', async () => {
    httpClientSpy.post.mockClear()
    httpClientSpy.post.mockReset()
    httpClientSpy.post
      .mockResolvedValueOnce({
        data: {
          access_token: 'any_access_token',
          expires_in: 60,
          refresh_expires_in: 0,
          token_type: 'Bearer',
          'not-before-policy': 0,
          scope: 'profile email',
        },
        statusCode: 200,
        headers: {},
      })
      .mockResolvedValueOnce({
        data: undefined,
        statusCode: 500,
        headers: {},
      })

    const promise = sut.saveWithKeycloak({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      firstName: 'any_first_name',
      lastName: 'any_last_name',
    })

    await expect(promise).rejects.toThrow(new Error('failed to create user'))
  })

  it('should throw if getAuthToken access_token is undefined', async () => {
    httpClientSpy.post.mockClear()
    httpClientSpy.post.mockReset()
    httpClientSpy.post.mockResolvedValueOnce({
      data: undefined,
      statusCode: 200,
      headers: {},
    })

    const promise = sut.saveWithKeycloak({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      firstName: 'any_first_name',
      lastName: 'any_last_name',
    })

    await expect(promise).rejects.toThrow(new Error('failed to get keycloak access token'))
  })
})
