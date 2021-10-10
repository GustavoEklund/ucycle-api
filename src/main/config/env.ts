export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '1054199952077180',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '4ade5889320b6dba1d1341b736343e62',
    accessToken: process.env.FB_ACCESS_TOKEN ?? ''
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'w389eh3rbhu9nfy823349-rinmfi9w389w'
}
