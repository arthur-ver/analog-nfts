import type { NextApiRequest, NextApiResponse } from 'next'
import { sha256FromBuffer } from '@zoralabs/zdk'
import axios from 'axios'
import jwt from 'next-auth/jwt'
import { encryption, secret, signingKey, encryptionKey } from '../../lib/jwtSecrets'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req
    const { url } = body
    const token = await jwt.getToken({ req, secret, signingKey, encryptionKey, encryption })
    if (token && req.method === 'POST' && url) {
        try {
            const response = await axios.get(`https://${process.env.NEXT_PUBLIC_FLEEK_BUCKET}.storage.fleek.co/${url}`, { responseType: 'arraybuffer' })
            const buffer = Buffer.from(response.data, 'utf-8')
            const hash = sha256FromBuffer(buffer)
            res.status(200).json({ hash })
        } catch (error) {
            res.status(500).json({ error })
        }
    } else {
        res.status(502).json({ error: 'Bad gateway 502' })
    }
}