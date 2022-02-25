declare namespace Express {
  interface Request {
    locals?: any
    kauth?: {
      grant: {
        access_token: {
          content: {
            sub: string
          }
        }
      }
    }
  }
}
