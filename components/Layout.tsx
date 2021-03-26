import Link from 'next/link'
import { useCallback, useState, useEffect } from 'react'
import { useZora } from './ZoraProvider'
import Web3 from 'web3'

function Header () {
    const { address } = useZora()

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
                    <span>{address}</span>
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