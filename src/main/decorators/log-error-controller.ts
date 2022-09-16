import { Controller } from '@/application/controllers'
import { HttpResponse, HttpStatus } from '@/application/helpers'
import { SaveErrorLogRepository } from '@/domain/contracts/repos'
import { ErrorLog, Exception } from '@/domain/entities/errors'
import { UUIDGenerator } from '@/domain/contracts/gateways'

type HttpRequest = any

export class LogErrorControllerDecorator extends Controller {
  public constructor(
    private readonly controller: Controller,
    private readonly crypto: UUIDGenerator,
    private readonly errorLogRepository: SaveErrorLogRepository
  ) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (this.isErrorStatus(httpResponse.statusCode) && this.isArrayOfErrors(httpResponse.data)) {
      const userId = typeof httpRequest.userId === 'string' ? httpRequest.userId : undefined
      for (const error of httpResponse.data) {
        const errorLog = new ErrorLog({
          id: this.crypto.uuid(),
          code: error?.code ?? error?.name,
          message: error.message,
          stack: error.stack,
          userId,
        })
        await this.errorLogRepository.save(errorLog)
      }
    }
    return httpResponse
  }

  private isErrorStatus(statusCode: number): boolean {
    const errorStatuses = [
      HttpStatus.badRequest,
      HttpStatus.unauthorized,
      HttpStatus.forbidden,
      HttpStatus.notFound,
      HttpStatus.conflict,
      HttpStatus.serverError,
    ]
    return errorStatuses.includes(statusCode)
  }

  private isArrayOfErrors(data: any): boolean {
    return Array.isArray(data) && data.every((e) => e instanceof Exception)
  }
}
