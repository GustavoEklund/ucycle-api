import { ErrorLog } from '@/domain/entities/errors'

export interface SaveErrorLogRepository {
  save(errorLog: ErrorLog): Promise<void>
}
