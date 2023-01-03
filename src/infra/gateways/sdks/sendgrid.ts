import { Mailer } from '@/domain/contracts/gateways'
import SendGridSdk from '@sendgrid/mail'
import { LoadEmailTemplate } from '@/domain/contracts/repos'

export class SendGridSdkGateway implements Mailer {
  public readonly sender: { email: string; name: string }
  private emailTemplateRepository: LoadEmailTemplate

  public constructor({
    apiKey,
    sender,
    emailTemplateRepository,
  }: {
    apiKey: string
    sender: { email: string; name: string }
    emailTemplateRepository: LoadEmailTemplate
  }) {
    SendGridSdk.setApiKey(apiKey)
    this.sender = sender
    this.emailTemplateRepository = emailTemplateRepository
  }

  public async send({ subject, recipient, sender, body }: Mailer.Input): Promise<Mailer.Output> {
    const [clientResponse] = await SendGridSdk.send({
      to: recipient,
      from: sender ?? this.sender,
      subject,
      html: body,
      text: body ?? '',
    })
    if (clientResponse.statusCode !== 202) throw new Error('error sending email')
  }

  public async sendWithTemplate({
    subject,
    recipient,
    sender,
    template,
  }: Mailer.InputWithTemplate): Promise<Mailer.Output> {
    const emailTemplate = await this.emailTemplateRepository.load({ code: template.code })
    if (emailTemplate === undefined) throw new Error('email template not found')
    const [clientResponse] = await SendGridSdk.send({
      to: recipient,
      from: sender ?? this.sender,
      subject,
      templateId: emailTemplate.id,
      personalizations: [
        {
          to: recipient,
          from: sender ?? this.sender,
          subject,
          dynamicTemplateData: template.data,
        },
      ],
    })
    if (clientResponse.statusCode !== 202) throw new Error('error sending email')
  }
}
