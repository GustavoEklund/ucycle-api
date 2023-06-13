import { DeleteFile, UploadFile } from '@/domain/contracts/gateways'

import { config, S3 } from 'aws-sdk'

export class AwsS3FileStorage implements UploadFile, DeleteFile {
  public constructor(
    accessKey: string,
    secret: string,
    private readonly bucket: string,
    private readonly endpoint: string = 's3.amazonaws.com',
    private readonly url: string = `https://${bucket}.${endpoint}`
  ) {
    config.update({
      s3: {
        endpoint: this.endpoint,
        s3BucketEndpoint: true,
      },
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret,
      },
    })
  }

  public async upload({ file }: UploadFile.Input): Promise<UploadFile.Output> {
    await new S3()
      .putObject({
        Bucket: this.bucket,
        Key: `${this.bucket}/${file.name}`,
        ContentType: file.mimeType,
        Body: file.buffer,
        ACL: 'public-read',
      })
      .promise()
    return `${this.url}/${encodeURIComponent(file.name)}`
  }

  public async delete({ fileName }: DeleteFile.Input): Promise<void> {
    await new S3()
      .deleteObject({
        Bucket: this.bucket,
        Key: fileName,
      })
      .promise()
  }
}
