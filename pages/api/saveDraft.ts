import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'next-auth/jwt'
import { encryption, secret, signingKey, encryptionKey } from '../../lib/jwtSecrets'
import prisma from '../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req
    const { photoCID, photoCDN } = body
    const token = await jwt.getToken({ req, secret, signingKey, encryptionKey, encryption })
    if (token && req.method === 'POST' && photoCID && photoCDN) {
        try {
            const draft = await prisma.draftNft.create({
                data: {
                    photoCID,
                    photoCDN,
                    user: {
                        connect: {
                            id: token.id
                        }
                    }
                }
            })
            res.status(200).json({ draft })
        } catch (error) {
            res.status(500).json({ error })
        }
    } else {
        res.status(502).json({ error: 'Bad gateway 502' })
    }
}