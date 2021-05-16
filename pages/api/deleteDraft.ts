import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'next-auth/jwt'
import { encryption, secret, signingKey, encryptionKey } from '../../lib/jwtSecrets'
import S3 from 'aws-sdk/clients/s3'
import prisma from '../../lib/prisma'

const ImageKit = require('imagekit')

const apiKey = process.env.NEXT_PUBLIC_FLEEK_STORAGE
const apiSecret = process.env.FLEEK_STORAGE_PRIVATE
const bucket = process.env.NEXT_PUBLIC_FLEEK_BUCKET

var imagekit = new ImageKit({
    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC,
    privateKey : process.env.IMAGEKIT_PRIVATE,
    urlEndpoint : `https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_ID}/`
})

const s3 = new S3({
    accessKeyId: apiKey,
    secretAccessKey: apiSecret,
    endpoint: 'https://storageapi.fleek.co',
    region: 'us-east-1',
    s3ForcePathStyle: true
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req
    const { id } = body
    const token = await jwt.getToken({ req, secret, signingKey, encryptionKey, encryption })
    if (token && req.method === 'POST' && id) {
        try {
            const draft = await prisma.draftNft.findFirst({
                where: { user: { id: token.id } }
            })
            if (draft) {
                const { photoCDNid, s3Key } = draft
                const imagekitResponse = await imagekit.deleteFile(photoCDNid)
                const s3Response = await s3.deleteObject({ Bucket: bucket, Key: s3Key }).promise()
                const deleteDraft = await prisma.draftNft.deleteMany({
                    where: { user: { id: token.id } }
                })
                res.status(200).json({ success: true, response: { deleteDraft, imagekitResponse, s3Response } })
            } else {
                throw 'Draft does not belong to user'
            }
        } catch (error) {
            res.status(500).json({ error })
        }
    } else {
        res.status(502).json({ error: 'Bad gateway 502' })
    }
}