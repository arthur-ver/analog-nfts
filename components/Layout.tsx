import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useZora } from './ZoraProvider'
import { signIn, signOut, useSession } from 'next-auth/client'

const Header = () => {
    const [ session, loading ] = useSession()
    const [isLoading, setLoading] = useState(false)
    const { address, disp_address, identicon, authenticate, signer } = useZora()

    const handleConnectClick = useCallback(() => {
        setLoading(true)
        authenticate().then(() => {
            setLoading(false)
        })
        .catch(() => {
            setLoading(false)
        })
    }, [authenticate])

    const handleSignInClick = useCallback(async () => {
        const signature = await signer.signMessage('Login message')
        signIn('credentials', {
            signature,
            address
        })
    }, [signer, address])

    return (
        <header className="sticky top-0 z-10 bg-white flex justify-between items-centered border-b border-gray-300 pt-4 pl-6 pr-6 pb-4">
            <div className="flex items-center space-x-3">
                <Link href="/">
                    <a><span className="font-bold text-2xl">ANALOG</span></a>
                </Link>
                <span>NFT platform</span>
            </div>
            <div className="flex items-center space-x-6">
                <Link href="/">
                    <a className="ext-gray-500 font-medium hover:underline">Explore</a>
                </Link>
                <Link href="/">
                    <a className="ext-gray-500 font-medium hover:underline">FAQ</a>
                </Link>
                {address ? (
                    <div className="flex items-center space-x-6">
                        {session ? (
                            <>
                                <Link href="/mint">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">Mint</button>
                                </Link>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-cover bg-no-repeat rounded-sm rounded-full" style={{backgroundImage: `url(${identicon})`}}></div>
                                    <span>{disp_address}</span>
                                </div>
                                <button onClick={() => signOut()} disabled={isLoading} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={() => handleSignInClick()} disabled={isLoading} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                                {isLoading ? 'Verifying...' : 'Login'}
                            </button>
                        )}
                    </div>
                ) : (
                    <button onClick={handleConnectClick} disabled={isLoading} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                        {isLoading ? 'Connecting...' : 'Connect to MetaMask'}
                    </button>
                )}
            </div>
        </header>
    )
}

const Footer = () => (
    <h1>H1</h1>
)

export { Header, Footer }