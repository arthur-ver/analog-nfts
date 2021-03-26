import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'
import { ethers, providers } from 'ethers'
import { Zora } from '@zoralabs/zdk'
import Web3Modal from 'web3modal'

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
    const [signer, setSigner] = useState<any>(undefined)
    
    const chainId: number = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

    return <ZoraContext.Provider value={{zora, address}} children={children} />
}

export { useZora, ZoraProvider }