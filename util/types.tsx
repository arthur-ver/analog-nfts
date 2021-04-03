export interface INFT {
    id: number
    tokenId: number
    title: string
    description: string
    photoCID: string
    photoCDN: string
    metadataCID: string
    creator: string
    createdAt: Date
    identicon?: string
}

export interface IFetch {
    nfts: INFT[]
    count?: number
    error?: { message: string }
}