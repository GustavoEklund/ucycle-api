import { Mailer } from '@/domain/contracts/gateways'
import SendGridSdk from '@sendgrid/mail'

export abstract class SendGridMailer implements Mailer {
  public readonly sender: { email: string; name: string }

  protected constructor({
    apiKey,
    sender,
  }: {
    apiKey: string
    sender: { email: string; name: string }
  }) {
    SendGridSdk.setApiKey(apiKey)
    this.sender = sender
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
    const [clientResponse] = await SendGridSdk.send({
      to: recipient,
      from: sender ?? this.sender,
      subject,
      templateId: template.id,
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
