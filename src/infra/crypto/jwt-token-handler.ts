import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'
import { sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }

  async validateToken ({ token }: TokenValidator.Input): Promise<void> {
    verify(token, this.secret)
  }
}
