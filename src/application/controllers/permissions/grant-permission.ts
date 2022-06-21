import { HttpResponse, ok } from '@/application/helpers'

import { GrantPermission } from '@/domain/use-cases/permissions'
import { Controller } from '../controller'

type HttpRequest = {
  grantById: string
  grantToId: string
  code: string
  read: boolean
  write: boolean
  owner: boolean
  status: string
  moduleId: string
  resourceId: string
}

export class GrantPermissionController extends Controller {
  public constructor(private readonly grantPermission: GrantPermission) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<undefined>> {
    await this.grantPermission.perform(httpRequest)

    return ok(undefined)
  }
}
