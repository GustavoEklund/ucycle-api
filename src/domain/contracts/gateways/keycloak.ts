export interface SaveKeycloakUserAccount {
  saveWithKeycloak: (
    params: SaveKeycloakUserAccount.Input
  ) => Promise<SaveKeycloakUserAccount.Output>
}

export namespace SaveKeycloakUserAccount {
  export type Input = {
    id?: string
    email: string
    firstName: string
    lastName: string
  }
  export type Output = {
    id: string
  }
}
