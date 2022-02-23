declare namespace Express {
  interface Request {
    locals?: any
    kauth?: {
      grant: {
        accessToken: {
          content: {
            sub: string
          }
        }
      }
    }
  }
}
