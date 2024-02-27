import { AbstractFileService, FileServiceUploadResult, TransactionBaseService } from "@medusajs/medusa"
import aws from "aws-sdk"
import fs from "fs"
import { parse } from "path"
import stream from "stream"

type UploadResponse = {
  url: string
  key: string
}

class LocalFileService extends TransactionBaseService {

  private bucket_;
  private spacesUrl_;
  private accessKeyId_;
  private secretAccessKey_;
  private region_;
  private endpoint_;
  private downloadUrlDuration;

  constructor({ }, options) {
    super({}, options)
    options = {
      spaces_url: process.env.SPACE_URL,
      bucket: process.env.SPACE_BUCKET,
      endpoint: process.env.SPACE_ENDPOINT,
      access_key_id: process.env.SPACE_ACCESS_KEY_ID,
      secret_access_key: process.env.SPACE_SECRET_ACCESS_KEY,
    }
    this.bucket_ = options.bucket
    this.spacesUrl_ = options.spaces_url?.replace(/\/$/, "")
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.region_ = options.region
    this.endpoint_ = options.endpoint
    this.downloadUrlDuration = options.download_url_duration ?? 60 // 60 seconds
  }

  async upload(file, folder = '', mime = 'image/svg+xml') {
    this.updateAwsConfig()
    return this.uploadFile(file, { isProtected: false, acl: undefined, folder, mime })
  }

  uploadFile(file, options = { isProtected: false, acl: undefined, folder: '', mime: 'image/svg+xml' }): Promise<UploadResponse> {
    const parsedFilename = parse(file.originalname)
    let fileKey = `templates/${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`
    if (options.folder.length > 0) {
      fileKey = `${options.folder}/${parsedFilename.name}${parsedFilename.ext}`
    }

    const s3 = new aws.S3()
    const params = {
      ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
      ContentType: options.mime,
    }

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        if (this.spacesUrl_) {
          resolve({ url: `${this.spacesUrl_}/${data.Key}`, key: data.Key })
        }

        resolve({ url: data.Location, key: data.Key })
      })
    })
  }

  async delete(file: string) {
    this.updateAwsConfig()
    var index = file.indexOf('.com/') + 5;
    var key = file.substring(index)



    const s3 = new aws.S3()
    const params = {
      Bucket: this.bucket_,
      Key: `${key}`,
    }

    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }

  async getUploadStreamDescriptor(fileData) {
    this.updateAwsConfig()

    const pass = new stream.PassThrough()

    const fileKey = `${fileData.name}.${fileData.ext}`
    const params = {
      ACL: fileData.acl ?? "private",
      Bucket: this.bucket_,
      Body: pass,
      Key: fileKey,
    }

    const s3 = new aws.S3()
    return {
      writeStream: pass,
      promise: s3.upload(params).promise(),
      url: `${this.spacesUrl_}/${fileKey}`,
      fileKey,
    }
  }

  async getDownloadStream(fileData) {
    this.updateAwsConfig()

    const s3 = new aws.S3()

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    }

    return s3.getObject(params).createReadStream()
  }

  async find(productId: string) {
    this.updateAwsConfig()

    const s3 = new aws.S3()
    const params = {
      Bucket: this.bucket_,
      Key: productId,
    }
    let response: any;
    try {
      response = await s3.getObject(params).promise()
      const content = response.Body.toString('utf-8')
      return content;
    } catch (error) {
      response = error?.message;
    }
    return response
  }

  async getPresignedDownloadUrl(fileData) {
    this.updateAwsConfig({
      signatureVersion: "v4",
    })

    const s3 = new aws.S3()

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
      Expires: this.downloadUrlDuration,
    }

    return await s3.getSignedUrlPromise("getObject", params)
  }

  updateAwsConfig(additionalConfiguration = {}) {
    aws.config.setPromisesDependency(null)
    aws.config.update(
      {
        accessKeyId: this.accessKeyId_,
        secretAccessKey: this.secretAccessKey_,
        region: this.region_,
        endpoint: this.endpoint_,
        ...additionalConfiguration,
      },
      true
    )
  }
}

export default LocalFileService