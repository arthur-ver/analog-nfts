export interface INFT {
    id: number
    tokenId: string
    photoCID: string
    metadataCID: string
    creator: string
    createdAt: string
}

export interface IFetch {
    nfts: INFT[]
    count: number
    error?: { message: string }
}