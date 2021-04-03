import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'
import { ethers } from 'ethers'
import { Zora } from '@zoralabs/zdk'
import Avatars from '@dicebear/avatars'
import sprites from '@dicebear/avatars-identicon-sprites'

declare global {
    interface Window {
        ethereum: any
    }
}

type ZoraProviderProps = {children: ReactNode}

const ZoraContext = createContext(undefined)

function useZora() {
    const context = useContext(ZoraContext)
    if(context === undefined) throw new Error('useZora() must be used within a ZoraProvider')
    return context
}

function ZoraProvider({children}: ZoraProviderProps) {
    const [zora, setZora] = useState<any>(undefined)
    const [address, setAddress] = useState<any>(undefined)
    const [disp_address, setDispAddress] = useState<any>(undefined)
    const [identicon, setIdenticon] = useState<any>(undefined)
    const [signer, setSigner] = useState<any>(undefined)

    let options = {
        dataUri: true,
        background: '#ececec'

    }
    let avatars = new Avatars(sprites, options)
    
    const chainId: number = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

    const handleAccountsChanged = ((accounts: Array<string>) => {
        if(accounts.length === 0) {
            console.log('%c MetaMask detected, not connected', 'color: orange')
            setAddress(undefined)
            setDispAddress(undefined)
            setIdenticon(undefined)
            setSigner(undefined)
        } else if (accounts[0] !== address) {
            let address: string = accounts[0]
            let disp_address: string = `${address.substring(0, 5)}...${address.substring(address.length - 3)}`
            let identicon: string = avatars.create(address)
            let signer: ethers.providers.JsonRpcSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner()
            let zora: Zora = new Zora(signer, chainId)
            setAddress(address)
            setDispAddress(disp_address)
            setIdenticon(identicon)
            setSigner(signer)
            setZora(zora)
        }
    })

    const handleChainChanged = ((_chainId: number) => {
        _chainId != chainId ? alert('Currently selected network is not yet supported') : console.log('%c Network changed', 'color: green')
    })

    const authenticate = useCallback(() => {
        return new Promise((resolve, reject) => {
            if(typeof window.ethereum === 'undefined') {
                alert('Please install MetaMask')
                return
            }
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then((accounts) => {
                    handleAccountsChanged(accounts)
                    resolve(true)
                })
                .catch((err) => {
                    err.code === 4001 ? console.log('%c Please connect to MetaMask.', 'color: orange') : console.error(err)
                    reject(false)
                })
        })
    }, [])

    useEffect(() => {
        if(typeof window.ethereum === 'undefined') {
            console.log('%c MetaMask is not installed', 'color: orange')
            return
        }
        window.ethereum.on('accountsChanged', (accounts: Array<string>) => handleAccountsChanged(accounts))
        window.ethereum.request({ method: 'eth_accounts' })
            .then((accounts: Array<string>) => handleAccountsChanged(accounts))
            .catch((err) => { console.error(err) })
        window.ethereum.on('chainChanged', (_chainId: string) => handleChainChanged(parseInt(_chainId)))
    }, [])

    return <ZoraContext.Provider value={{ zora, address, disp_address, identicon, authenticate }} children={children} />
}

export { useZora, ZoraProvider }