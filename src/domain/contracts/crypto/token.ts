export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => Promise<TokenGenerator.Result>
}

export namespace TokenGenerator {
  export type Params = {
    key: string
    expirationInMs: number
  }

  export type Result = string
}

export interface TokenValidator {
  validateToken: (params: TokenValidator.Input) => Promise<TokenValidator.Output>
}

namespace TokenValidator {
  export type Input = { token: string }
  export type Output = string
}
