import { Fragment } from 'react'
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { InferGetServerSidePropsType } from 'next'
import { Header, Footer } from '../components/Layout'
import prefixURL from '../util/prefix'
import InfiniteScroll from 'react-infinite-scroll-component'
import { INFT, IFetch } from '../util/types'
import { IKImage, IKContext } from 'imagekitio-react'
import Avatars from '@dicebear/avatars'
import sprites from '@dicebear/avatars-identicon-sprites'
import moment from 'moment'
import { ListLoader } from '../components/ListLoader'

const Index = ({ items }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [nfts, setNFTs] = useState<Array<INFT> | []>([])
    const [cursor, setCursor] = useState<number | undefined>(undefined)
    const [EOL, setEOL] = useState<boolean>(false)

    let options = { dataUri: true, background: '#ececec' }
    let avatars = new Avatars(sprites, options)

    useEffect(() => {
        if (items.nfts.length > 0) {
            if (items.error) return
            let cursor_: number = items.nfts.slice(-1).pop().id - 1
            items.nfts.forEach(el => el.identicon = avatars.create(el.creator))
            setNFTs(items.nfts)
            setCursor(cursor_)
            if (cursor_ == 0)
                setEOL(true)
            else
                setEOL(false)
        }
    }, [items])

    const fetchMoreData = async () => {
        try {
            let res = await fetch(`${prefixURL}/api/fetchNFTs?cursor=${cursor}`)
            if (res.status !== 200) throw new Error('Failed to fetch')
            let items = await res.json()
            let cursor_: number = items.nfts.slice(-1).pop().id - 1
            items.nfts.forEach(el => el.identicon = avatars.create(el.creator))
            if (cursor_ == 0) setEOL(true)
            setNFTs(prevNFTs => [...prevNFTs, ...items.nfts])
            setCursor(cursor_)
        } catch (err) {
            throw new Error(err.message)
        }
      }

    return <>
        <Head>
            <title>ANALOG NFTs</title>
        </Head>
        <Header />
        <main>
            <IKContext urlEndpoint={`https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_ID}/`}>
                <InfiniteScroll
                scrollThreshold="400px"
                dataLength={nfts.length}
                next={fetchMoreData}
                hasMore={!EOL}
                loader={<ListLoader/>}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
                        {nfts.map((nft: INFT, index) => (
                            <div key={index} className="p-4 border-l border-b border-gray-200 transition hover:shadow-md">
                                <Link key={nft.tokenId} href={`/item/${encodeURIComponent(nft.tokenId)}`}>
                                    <a>
                                        <IKImage className="w-full" 
                                        path={nft.photoCDN} transformation={[{"height": "900","width": "720"}]}
                                        loading="lazy"
                                        lqip={{ active: true, blur: 10 }} />
                                    </a>
                                </Link>
                                <div className="flex flex-col pt-8 space-y-4 prose">
                                    <Link key={nft.tokenId} href={`/item/${encodeURIComponent(nft.tokenId)}`}>
                                        <a className="m-0 self-start no-underline hover:underline">"{nft.title}"</a>
                                    </Link>
                                    {nft.description.length > 70 ? (
                                        <p className="text-black flex-grow min-h-4">{nft.description.substring(0, 70)}...</p>
                                    ) : (
                                        <p className="text-black flex-grow min-h-4">{nft.description}</p>
                                    )}
                                    <span className="self-end inline-flex items-center justify-center px-3 py-1 leading-none text-gray-400 bg-gray-100 rounded-full">{moment(nft.createdAt).format('L')}</span>
                                    <div className="flex flex-row justify-between items-center">
                                        <div>creator:</div>
                                        <div className="flex flex-row items-center space-x-3">
                                            <div className="w-7 h-7 bg-cover bg-no-repeat rounded-sm rounded-full" style={{backgroundImage: `url(${nft.identicon})`}}></div>
                                            <div>{nft.creator.substring(0, 5)}...{nft.creator.substring(nft.creator.length - 3)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </IKContext>
        </main>
    </>
}

export const getServerSideProps = async() => {

    const cursor: number = null
    let items: IFetch

    try {
        const res = await fetch(`${prefixURL}/api/fetchNFTs?cursor=${cursor}`)
        if (res.status !== 200) throw new Error('Failed to fetch')
        items = await res.json()
    } catch (err) {
        items = { nfts: [], count: null, error: { message: err.message } }
    }

    return { props: { items } }
}

export default Index