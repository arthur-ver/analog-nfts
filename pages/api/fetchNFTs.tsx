import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { query: { cursor } } = req
    return new Promise(function (resolve, reject){
        console.log(cursor)
        if (cursor === 'null') {
            prisma.$transaction([
                prisma.nft.findMany({
                    take: 8,
                    skip: 0,
                    orderBy: { id: 'desc', },
                }),
                prisma.nft.count()
            ])
            .then(_req => resolve(_req))
            .catch(e => res.status(502).json({error: e}))
        } else {
            prisma.$transaction([
                prisma.nft.findMany({
                    take: 8,
                    skip: 0,
                    cursor: {
                        id: Number(cursor),
                    },
                    orderBy: { id: 'desc', },
                }),
                prisma.nft.count()
            ])
            .then(_req => resolve(_req))
            .catch(e => res.status(502).json({error: e}))
        }
    })
    .then(_req => {
        return new Promise(function (resolve, reject){
            prisma.$disconnect().then(() => resolve(_req))
        })
    })
    .then(_req => {
        const nfts = _req[0]
        const max = _req[1]
        res.status(200).json({nfts: nfts, count: max})
    })
}