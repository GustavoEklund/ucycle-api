import { SaveKeycloakUserAccount } from '@/domain/contracts/gateways'
import { HttpPostClient, HttpPutClient } from '@/infra/gateways/client'
import { URLSearchParams } from 'url'
import { HttpStatus } from '@/application/helpers'

type AuthenticationToken = {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  token_type: string
  'not-before-policy': number
  scope: string
}

export class KeycloakApi implements SaveKeycloakUserAccount {
  public constructor(
    private readonly httpClient: HttpPostClient & HttpPutClient,
    private readonly baseUrl: string,
    private readonly realm: string,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  public async saveWithKeycloak({
    id,
    email,
    password,
    lastName,
    firstName,
  }: SaveKeycloakUserAccount.Input): Promise<SaveKeycloakUserAccount.Output> {
    const authToken = await this.getAuthToken()
    const {
      statusCode: createUserStatusCode,
      headers,
      error: createUserError,
    } = await this.httpClient.post<undefined>({
      url: this.makeAdminUrl('/users'),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken.access_token}`,
      },
      body: {
        id,
        enabled: true,
        email,
        firstName,
        lastName,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
        username: email,
        requiredActions: ['VERIFY_EMAIL'],
      },
    })
    if (createUserStatusCode !== HttpStatus.created) {
      const error = new Error('failed to create user')
      if (createUserError !== undefined) {
        error.stack = createUserError.stack
      }
      throw error
    }
    id = headers?.location?.split('/')?.pop()
    if (id === undefined) {
      throw new Error('failed to get user id')
    }
    const { statusCode: executeActionsStatusCode, error: executeActionsError } =
      await this.httpClient.put<undefined>({
        url: this.makeAdminUrl(`/users/${id}/execute-actions-email`),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken.access_token}`,
        },
        body: ['UPDATE_PASSWORD', 'VERIFY_EMAIL'],
      })
    if (executeActionsStatusCode !== HttpStatus.noContent) {
      const error = new Error('failed to send confirmation email')
      if (executeActionsError !== undefined) {
        error.stack = executeActionsError.stack
      }
      throw error
    }
    return { id }
  }

  private makeUrl(path: string): string {
    return `${this.baseUrl}/realms/${this.realm}${path}`
  }

  private makeAdminUrl(path: string): string {
    return `${this.baseUrl}/admin/realms/${this.realm}${path}`
  }

  private async getAuthToken(): Promise<AuthenticationToken> {
    const { data: authenticationToken } = await this.httpClient.post<AuthenticationToken>({
      url: this.makeUrl('/protocol/openid-connect/token'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    })
    return authenticationToken
  }
}
