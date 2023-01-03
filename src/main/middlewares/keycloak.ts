import { keycloak } from '@/main/config/keycloak'

export const keycloakMiddleware = () => {
  return keycloak.middleware({ logout: '/api/logout', admin: '/' })
}
