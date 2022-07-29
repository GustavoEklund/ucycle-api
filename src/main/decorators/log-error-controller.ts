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
    if (httpResponse.statusCode === HttpStatus.serverError) {
      const error = httpResponse.data[0]
      const errorLog = new ErrorLog({
        id: this.crypto.uuid(),
        code: error?.code ?? error?.name,
        message: error.message,
        stack: error.stack,
      })
      await this.errorLogRepository.save(errorLog)
    }
    return httpResponse
  }
}
