import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })

const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: s3BucketName,
        Key: todoId,
        Expires: urlExpiration
    })
}

export async function deleteAttachment(todoId: string)  {        
    await s3.deleteObject({
        Bucket: s3BucketName,
        Key: todoId
    }).promise()
}