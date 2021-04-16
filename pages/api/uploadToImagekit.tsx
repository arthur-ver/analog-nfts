import type { NextApiRequest, NextApiResponse } from 'next'
const ImageKit = require('imagekit')

var imagekit = new ImageKit({
    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC,
    privateKey : process.env.IMAGEKIT_PRIVATE,
    urlEndpoint : `https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_ID}/`
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req
    if (req.method === 'POST' && body.url && body.fileName && body.fileExtension) {
        try {
            const file = `https://storageapi.fleek.co/${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${body.url}`
            const fileName = `${body.fileName}.${body.fileExtension}`
            const response = await imagekit.upload({
                file,
                fileName
            })
            res.status(200).json(response)
        } catch (e) {
            res.status(500).json({ error: e })
        }  
    } else {
        res.status(502).json({ error: 'Bad gateway 502' })
    }
}