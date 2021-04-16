import type { NextApiRequest, NextApiResponse } from 'next'
import { sign, verify } from 'jsonwebtoken'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { body } = req
        if (body.authRequest) {
            const request = body.authRequest
            const token = sign({ request }, process.env.JWT_SECRET, { expiresIn: 15*60 })
            res.status(200).json({ token })
        } else if (body.verifyRequest) {
            const request = body.verifyRequest
            verify(request, process.env.JWT_SECRET, (err, data) => {
                if (err) res.status(403).end()
                else res.status(200).json(data)
            })
        } else {
            res.status(502).json({ error: 'Bad gateway 502' })
        }
    } else {
        res.status(502).json({ error: 'Bad gateway 502' })
    }
}
