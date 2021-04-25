import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'next-auth/jwt'
const ImageKit = require('imagekit')

const encryption = true
const secret = process.env.JWT_SECRET
const signingKey = process.env.JWT_SIGNING_KEY
const encryptionKey = process.env.JWT_ENCRYPTION_KEY

var imagekit = new ImageKit({
    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC,
    privateKey : process.env.IMAGEKIT_PRIVATE,
    urlEndpoint : `https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_ID}/`
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req
    const { url, fileName, fileExtension } = body
    const token = await jwt.getToken({ req, secret, signingKey, encryptionKey, encryption })
    if (token && req.method === 'POST' && url && fileName && fileExtension) {
        try {
            const file = `https://storageapi.fleek.co/${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${url}`
            const key = `${fileName}.${fileExtension}`
            const response = await imagekit.upload({
                file,
                fileName: key
            })
            res.status(200).json(response)
        } catch (e) {
            res.status(500).json({ error: e })
        }  
    } else {
        res.status(502).json({ error: 'Bad gateway 502' })
    }
}