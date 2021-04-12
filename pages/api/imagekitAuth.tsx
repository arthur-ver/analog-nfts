import type { NextApiRequest, NextApiResponse } from 'next'

const ImageKit = require("imagekit")

const imagekit = new ImageKit({
    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC,
    privateKey : process.env.IMAGEKIT_PRIVATE,
    urlEndpoint : `https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_ID}/`
})

export default (req: NextApiRequest, res: NextApiResponse) => {
    const authenticationParameters = imagekit.getAuthenticationParameters()
    res.status(200).json(authenticationParameters)
}