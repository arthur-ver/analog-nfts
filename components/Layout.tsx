import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useZora } from './ZoraProvider'
import { signIn, signOut, useSession } from 'next-auth/client'
import { AccountPopover } from './AccountPopover'

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
        <header className="filter sticky top-0 z-10 flex justify-between items-centered border-b border-gray-200 pt-4 pl-6 pr-6 pb-4 bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm">
            <div className="flex items-center space-x-3">
                <Link href="/">
                    <a><span className="font-bold text-2xl">ANALOG</span></a>
                </Link>
                <span>NFT platform</span>
            </div>
            <div className="flex items-center space-x-6 prose">
                <Link href="/">
                    <a className="hover:underline">Explore</a>
                </Link>
                <Link href="/">
                    <a className="hover:underline">FAQ</a>
                </Link>
                {address ? (
                    <div className="flex items-center space-x-6">
                        {session ? (
                            <>
                                <Link href="/mint">
                                    <button className="border-2 border-black py-2 px-6 rounded-full bg-black text-white focus:outline-none hover:bg-transparent hover:text-black transition-colors duration-200">
                                        Mint
                                    </button>
                                </Link>
                                <AccountPopover children={(
                                    <div className="py-2 px-2 pr-4 rounded-full flex items-center space-x-3 shadow hover:bg-gray-100">
                                        <div className="w-6 h-6 bg-cover bg-no-repeat rounded-sm rounded-full" style={{backgroundImage: `url(${identicon})`}}></div>
                                        <span>@arthur.verny</span>
                                    </div>
                                )} />
                                <button onClick={() => signOut()} disabled={isLoading} className="hidden bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={() => handleSignInClick()} disabled={isLoading} className="border-2 border-black py-2 px-6 rounded-full bg-black text-white focus:outline-none hover:bg-transparent hover:text-black transition-colors duration-200">
                                {isLoading ? 'Verifying...' : 'Login'}
                            </button>
                        )}
                    </div>
                ) : (
                    <button onClick={handleConnectClick} disabled={isLoading} className="border-2 border-black py-2 px-6 rounded-full bg-black text-white focus:outline-none hover:bg-transparent hover:text-black transition-colors duration-200">
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