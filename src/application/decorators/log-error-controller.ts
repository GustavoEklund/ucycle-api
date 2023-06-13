import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { Exception } from '@/domain/entities/errors'
import { LogErrors } from '@/domain/use-cases/errors'
import { DbTransaction } from '@/application/contracts'

type HttpRequest = any

export class LogErrorControllerDecorator extends Controller {
  public constructor(
    private readonly controller: Controller,
    private readonly logErrors: LogErrors,
    private readonly dbTransaction: DbTransaction
  ) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse> {
    const userId = typeof httpRequest.userId === 'string' ? httpRequest.userId : undefined
    const httpResponse = await this.controller.handle(httpRequest)
    const errors = httpResponse.data
    if (HttpResponse.isError(httpResponse) && this.isArrayOfErrors(errors)) {
      try {
        await this.dbTransaction.openTransaction()
        await this.logErrors.perform({ user: { id: userId }, errors })
        await this.dbTransaction.commit()
        await this.dbTransaction.closeTransaction()
      } catch (error) {
        await this.dbTransaction.rollback()
        await this.dbTransaction.closeTransaction()
        throw error
      }
    }
    return httpResponse
  }

  private isArrayOfErrors(data: any): data is (Error | Exception)[] {
    return Array.isArray(data) && data.every((e) => e instanceof Error || e instanceof Exception)
  }
}
