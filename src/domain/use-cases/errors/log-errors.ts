import { ErrorLog, Exception } from '@/domain/entities/errors'
import { UUIDGenerator } from '@/domain/contracts/gateways'
import { SaveErrorLogRepository } from '@/domain/contracts/repos'

export interface LogErrors {
  perform: (input: LogErrors.Input) => Promise<void>
}

export class LogErrorsUseCase implements LogErrors {
  public constructor(
    private readonly crypto: UUIDGenerator,
    private readonly errorLogRepository: SaveErrorLogRepository
  ) {}

  public async perform(input: LogErrors.Input): Promise<void> {
    for (const error of input.errors) {
      const errorLog = new ErrorLog({
        id: this.crypto.uuid(),
        code: error instanceof Exception ? error.code : error.name,
        message: error.message,
        stack: error.stack,
        userId: input.user.id,
      })
      await this.errorLogRepository.save(errorLog)
    }
  }
}

export namespace LogErrors {
  export type Input = {
    user: { id?: string }
    errors: (Exception | Error)[]
  }
}
