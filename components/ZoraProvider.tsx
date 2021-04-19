import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'
import { ethers } from 'ethers'
import { Zora } from '@zoralabs/zdk'
import Avatars from '@dicebear/avatars'
import sprites from '@dicebear/avatars-identicon-sprites'
import { authRequest } from '../lib/helpers'

declare global {
    interface Window {
        ethereum: any
    }
}

const useStateWithLocalStorage = (localStorageKey: string) => {
    const [value, setValue] = useState(process.browser ? (localStorage.getItem(localStorageKey) || undefined) : undefined)

    useEffect(() => {
        localStorage.setItem(localStorageKey, value)
    }, [value])

    return [value, setValue] as const
}

type ZoraProviderProps = {children: ReactNode}

const ZoraContext = createContext(undefined)

function useZora() {
    const context = useContext(ZoraContext)
    if (context === undefined)
        throw new Error('useZora() must be used within a ZoraProvider')
    return context
}

function ZoraProvider({children}: ZoraProviderProps) {
    const [zora, setZora] = useState<any>(undefined)
    const [address, setAddress] = useState<string | undefined>(undefined)
    const [disp_address, setDispAddress] = useState<any>(undefined)
    const [identicon, setIdenticon] = useState<any>(undefined)
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>(undefined)
    const [userId, setUserId] = useStateWithLocalStorage('userId')
    const [authToken, setAuthToken] = useStateWithLocalStorage('authToken')
    const [refreshTokenHash, setRefreshTokenHash] = useStateWithLocalStorage('refreshTokenHash')

    let options = {
        dataUri: true,
        background: '#ececec'

    }
    let avatars = new Avatars(sprites, options)
    
    const chainId: number = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

    const handleAccountsChanged = ((accounts: Array<string>) => {
        if (accounts.length === 0) {
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
            if (typeof window.ethereum === 'undefined') {
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

    const login = useCallback(async () => {
        const signature = await signer.signMessage('Login message')
        const { userId, authToken, refreshTokenHash } = await authRequest(signature, address)
        setUserId(userId)
        setAuthToken(authToken)
        setRefreshTokenHash(refreshTokenHash)
    }, [address, signer])

    const logout = useCallback(async () => {
        setUserId(undefined)
        setAuthToken(undefined)
        setRefreshTokenHash(undefined)
    }, [])

    const handleAuthTokensChanged = useCallback((userId_: string, authToken_: string, refreshTokenHash_: string) => {
        if (authToken_ !== authToken) {
            setAuthToken(authToken_)
            console.log('authToken updated')
        }
        if (refreshTokenHash_ !== refreshTokenHash) {
            setRefreshTokenHash(refreshTokenHash_)
            console.log('refreshTokenHash updated')
        }
    }, [userId, authToken, refreshTokenHash])

    useEffect(() => {
        if (typeof window.ethereum === 'undefined') {
            console.log('%c MetaMask is not installed', 'color: orange')
            return
        }
        window.ethereum.on('accountsChanged', (accounts: Array<string>) => handleAccountsChanged(accounts))
        window.ethereum.request({ method: 'eth_accounts' })
            .then((accounts: Array<string>) => handleAccountsChanged(accounts))
            .catch((err) => { console.error(err) })
        window.ethereum.on('chainChanged', (_chainId: string) => handleChainChanged(parseInt(_chainId)))
    }, [])

    return <ZoraContext.Provider value={{ zora, address, disp_address, identicon, authenticate, login, userId, authToken, refreshTokenHash, handleAuthTokensChanged }} children={children} />
}

export { useZora, ZoraProvider }