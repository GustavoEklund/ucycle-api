import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { DbTransaction } from '@/application/contracts'

export class DbTransactionControllerDecorator extends Controller {
  public constructor(private readonly decoratee: Controller, private readonly db: DbTransaction) {
    super()
  }

  public async perform(httpRequest: any): Promise<HttpResponse> {
    await this.db.openTransaction()
    try {
      const httpResponse = await this.decoratee.handle(httpRequest)
      if (HttpResponse.isServerError(httpResponse)) {
        await this.db.rollback()
        await this.db.closeTransaction()
        return httpResponse
      }
      await this.db.commit()
      await this.db.closeTransaction()
      return httpResponse
    } catch (error) {
      await this.db.rollback()
      await this.db.closeTransaction()
      throw error
    }
  }
}
