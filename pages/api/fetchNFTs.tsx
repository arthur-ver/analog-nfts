import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
    return new Promise(function (resolve, reject){
        prisma.nft.findMany()
            .then(data => resolve(data))
            .catch(e => res.status(502).json({error: e}))
    })
    .then(data => {
        return new Promise(function (resolve, reject){
            prisma.$disconnect().then(() => resolve(data))
        })
    })
    .then(data => {
        res.status(200).json({nfts: data})
    })
}