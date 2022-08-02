import { Controller } from '@/application/controllers'
import { HttpResponse, HttpStatus } from '@/application/helpers'
import { SaveErrorLogRepository } from '@/domain/contracts/repos'
import { ErrorLog } from '@/domain/entities/errors'
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
    const errorStatuses = [
      HttpStatus.badRequest,
      HttpStatus.unauthorized,
      HttpStatus.forbidden,
      HttpStatus.notFound,
      HttpStatus.conflict,
      HttpStatus.serverError,
    ]
    if (errorStatuses.includes(httpResponse.statusCode)) {
      const userId = httpRequest.userId
      const error = httpResponse.data[0]
      const errorLog = new ErrorLog({
        id: this.crypto.uuid(),
        code: error?.code ?? error?.name,
        message: error.message,
        stack: error.stack,
        userId: typeof userId === 'string' ? userId : undefined,
      })
      await this.errorLogRepository.save(errorLog)
    }
    return httpResponse
  }
}
