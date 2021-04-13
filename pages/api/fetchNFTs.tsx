import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { INFT } from '../../util/types'

export default (req: NextApiRequest, res: NextApiResponse) => {
    const { query: { cursor } } = req

    const query = async (cursor) => {
        const count = await prisma.nft.count()
        let tokens: INFT[]

        if (cursor === 'null') {
            tokens = await prisma.nft.findMany({
                take: 8,
                skip: 0,
                orderBy: { id: 'desc', },
            })
        } else {
            tokens = await  prisma.nft.findMany({
                take: 8,
                skip: 0,
                cursor: {
                    id: Number(cursor),
                },
                orderBy: { id: 'desc', },
            })
        }

        res.status(200).json({ nfts: tokens, count: count })
    }
    
    return query(cursor)
        .catch(e => res.status(502).json({error: e}))
        .finally(async () => {
            if(process.env.NODE_ENV == 'development')
                await prisma.$disconnect()
        })
}