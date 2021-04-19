import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { utils } from 'ethers'

export default NextAuth({
  providers: [
    Providers.Credentials({
        name: 'Custom provider',
        credentials: {
            signature: { type: 'text' },
            address: { type: 'text' },
        },
        async authorize(credentials) {
            const addressRecovered = utils.verifyMessage('Login message', credentials.signature)
            if (credentials.address === addressRecovered.toLowerCase()) {
                return { address: credentials.address }
            } else {
                return null
            }
        }
    }),
  ],
  session: {
      jwt: true
  },
})