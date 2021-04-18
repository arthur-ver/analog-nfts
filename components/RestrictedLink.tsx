import Link from 'next/link'
import React from 'react'
import { useZora } from '../components/ZoraProvider'

const RestrictedLink = ({ to, children }: {to: string, children: React.ReactNode}) => {
    const { userId, authToken, refreshTokenHash } = useZora()

    return(
        <Link href={{
            pathname: to,
            query: { userId, authToken, refreshTokenHash }
          }}>{children}</Link>
    )
}

export default RestrictedLink