import { HttpGetClient } from '@/infra/gateways'
import { LoadFacebookUser } from '@/domain/contracts/gateways'

type AppToken = {
  // eslint-disable-next-line camelcase
  access_token: string
}

type DebugToken = {
  data: {
    // eslint-disable-next-line camelcase
    user_id: string
  }
}

type UserInfo = {
  id: string
  name: string
  email: string
}

type Input = LoadFacebookUser.Params
type Output = LoadFacebookUser.Result

export class FacebookApi implements LoadFacebookUser {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser({ token }: Input): Promise<Output> {
    return this.getUserInfo(token)
      .then(({ id, name, email }) => ({ facebookId: id, name, email }))
      .catch(() => undefined)
  }

  private async getAppToken(): Promise<AppToken> {
    const httpResponse = await this.httpClient.get<{ access_token: string }>({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    })
    return {
      access_token: httpResponse.data.access_token,
    }
  }

  private async getDebugToken(clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()
    return this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken,
      },
    })
  }

  private async getUserInfo(clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken)
    const httpResponse = await this.httpClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken,
      },
    })
    return {
      id: httpResponse.data.id,
      name: httpResponse.data.name,
      email: httpResponse.data.email,
    }
  }
}
