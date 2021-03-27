import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
    return new Promise<void>(function (resolve, reject) {
        prisma.nft.create({
                data: {
                    tokenId: 3,
                    photoCID: 'bafybeihnvkforktxm3jcq27pkrwgmqalpwc6b5q73doagvif34oklcmouu',
                    metadataCID: 'bafkreicg7sa7kdlvxngeal4jmcbpa24wvszrevbvbeaxlra6fcmkzg5e5a',
                    creator: '0xe6353907848a3241cf9ebe13b0adfcaea8fce46c',
                },
            })
            .then(() => resolve())
            .catch(e => res.status(502).json({error: e}))
    })
    .then(() => {
        return new Promise<void>(function (resolve, reject){
            prisma.$disconnect().then(() => resolve())
        })
    })
    .then(() => {
        res.status(200).json({response: 'success'})
    })
}