import { TokenGenerator } from '@/domain/contracts/crypto'
import { JwtTokenGenerator } from '@/infra/crypto'
import { env } from '@/main/config/env'

export const makeJwtTokenGenerator = (): TokenGenerator => {
  return new JwtTokenGenerator(env.jwtSecret)
}
