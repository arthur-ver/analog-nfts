export interface INFT {
    id: number
    tokenId: string
    title: string
    description: string
    photoCID: string
    photoCDN: string
    metadataCID: string
    creator: string
    createdAt: string
    identicon?: string
}

export interface IFetch {
    nfts: INFT[]
    count?: number
    error?: { message: string }
}