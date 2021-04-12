import type { NextApiRequest, NextApiResponse } from 'next'
const ImageKit = require("imagekit")

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        res.status(200).json('ok')
    } else {
        res.status(502).json({error: 'Bad gateway 502'})
    }
}