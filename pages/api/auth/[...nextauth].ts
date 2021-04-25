import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { utils } from 'ethers'
import prisma from '../../../lib/prisma'

export default NextAuth({
    providers: [
        Providers.Credentials({
            name: 'Custom provider',
            credentials: {
                signature: { type: 'text' },
                address: { type: 'text' },
            },
            async authorize(credentials) {
                const { address } = credentials
                const addressRecovered = utils.verifyMessage('Login message', credentials.signature)
                if (address === addressRecovered.toLowerCase()) {
                    const user = await prisma.user.findUnique({
                        where: { address }
                    })
                    if (user) {
                        return { address }
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            }
        }),
    ],
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    pages: {
        error: '/auth/error',
    },
    jwt: {
        encryption: true,
        secret: process.env.JWT_SECRET,
        signingKey: process.env.JWT_SIGNING_KEY,
        encryptionKey: process.env.JWT_ENCRYPTION_KEY,
    }
})