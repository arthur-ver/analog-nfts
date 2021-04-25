import type { NextApiRequest, NextApiResponse } from 'next'
import S3 from 'aws-sdk/clients/s3'
import jwt from 'next-auth/jwt'
import { encryption, secret, signingKey, encryptionKey } from '../../lib/jwtSecrets'

const apiKey = process.env.NEXT_PUBLIC_FLEEK_STORAGE
const apiSecret = process.env.FLEEK_STORAGE_PRIVATE
const bucket = process.env.NEXT_PUBLIC_FLEEK_BUCKET

const generateRandomString = (length: number) => Math.random().toString(20).substr(2, length)

const s3 = new S3({
    accessKeyId: apiKey,
    secretAccessKey: apiSecret,
    endpoint: 'https://storageapi.fleek.co',
    region: 'us-east-1',
    s3ForcePathStyle: true
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req
    const { creatorAddress, contentType } = body
    const token = await jwt.getToken({ req, secret, signingKey, encryptionKey, encryption })
    if (token && req.method === 'POST' && creatorAddress && contentType) {
        const fileName = `${Date.now()}_${generateRandomString(6)}`
        const key = `${creatorAddress}/${fileName}`
        const getSignedUrl = new Promise((resolve, reject) => {
            s3.getSignedUrl('putObject', {
                Bucket: bucket,
                Key: key,
                ContentType: contentType,
                Expires: 100,
            }, (err, url) => {
                err ? reject(err) : resolve(url)
            })
        })
        return getSignedUrl
            .then(url => res.status(200).json({ url, fileName, key }))
            .catch(err => res.status(500).json({ error: err }))
    } else {
        res.status(502).json({ error: 'Bad gateway 502' })
    }
}