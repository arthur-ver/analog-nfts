import Link from 'next/link'
import { useCallback, useState, useEffect } from 'react'
import { useZora } from './ZoraProvider'

function Header () {
    const { address, disp_address, identicon } = useZora()

    return (
        <header className="flex justify-between items-centered border-b border-gray-500 pt-4 pl-6 pr-6 pb-4">
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
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-cover bg-no-repeat rounded-sm" style={{backgroundImage: `url(${identicon})`}}></div>
                        <span>{disp_address}</span>
                    </div>
                ) : (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">Connect to MetaMask</button>
                )}
            </div>
        </header>
    )
}

const Footer = () => (
    <h1>H1</h1>
)


const Container = () => (
    <h1>H1</h1>
)


export { Header, Footer, Container }