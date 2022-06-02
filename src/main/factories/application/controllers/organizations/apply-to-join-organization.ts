import { Controller } from '@/application/controllers'
import { ApplyToJoinOrganizationController } from '@/application/controllers/organizations'
import { makeApplyToJoinOrganizationUseCase } from '@/main/factories/domain/use-cases/organizations'

export const makeApplyToJoinOrganizationController = (): Controller => {
  return new ApplyToJoinOrganizationController(makeApplyToJoinOrganizationUseCase())
}
