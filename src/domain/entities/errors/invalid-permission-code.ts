import { Exception } from '@/domain/entities/errors'

export class InvalidPermissionCodeError extends Exception {
  public constructor(code: string) {
    super('InvalidPermissionCodeError', `the permission code ${code} is invalid`)
  }
}
