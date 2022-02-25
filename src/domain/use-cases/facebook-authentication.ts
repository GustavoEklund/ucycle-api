import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'

type Input = { token: string }
type Output = { access_token: string }
export type FacebookAuthentication = (params: Input) => Promise<Output>
type Setup = (
  facebook: LoadFacebookUser,
  userAccount: LoadUserAccount & SaveFacebookAccount,
  token: TokenGenerator
) => FacebookAuthentication

export const setupFacebookAuthentication: Setup =
  (facebook, userAccount, token) => async (params) => {
    const fbData = await facebook.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await userAccount.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await userAccount.saveWithFacebook(fbAccount)
      const access_token = await token.generate({
        key: id,
        expirationInMs: AccessToken.expirationInMs,
      })
      return { access_token }
    }
    throw new AuthenticationError()
  }
