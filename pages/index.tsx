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

const Index = ({ items }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [nfts, setNFTs] = useState<Array<INFT> | []>([])
    const [cursor, setCursor] = useState<number | undefined>(undefined)
    const [EOL, setEOL] = useState<boolean>(false)

    let options = { dataUri: true, background: '#ececec' }
    let avatars = new Avatars(sprites, options)

    useEffect(() => {
        if (items) {
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

    return (
        <Fragment>
            <Head>
                <title>ANALOG NFTs</title>
            </Head>
            <Header />
            <main>
                <IKContext urlEndpoint="https://ik.imagekit.io/eguuexqwdlq/">
                    <InfiniteScroll
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0"
                    scrollThreshold="400px"
                    dataLength={nfts.length}
                    next={fetchMoreData}
                    hasMore={!EOL}
                    loader={<h4>Loading...</h4>}>
                        {nfts.map((nft: INFT, index) => (
                            <div key={index} className="border border-gray-300 p-4 transition hover:shadow-md">
                                <Link href="/item/#">
                                    <a>
                                        <IKImage className="w-full" 
                                        path={nft.photoCDN} transformation={[{"height": "900","width": "720"}]}
                                        loading="lazy"
                                        lqip={{ active: true, blur: 10 }} />
                                    </a>
                                </Link>
                                <div className="flex flex-col pt-8 space-y-4 prose">
                                    <Link href="/">
                                        <a className="self-start no-underline hover:underline"><h2 className="m-0">{nft.title}</h2></a>
                                    </Link>
                                    {nft.description.length > 70 ? (
                                        <p className="flex-grow text-sm min-h-4">{nft.description.substring(0, 70)}...</p>
                                    ) : (
                                        <p className="flex-grow text-sm min-h-4">{nft.description}</p>
                                    )}
                                    <span className="self-end inline-flex items-center justify-center px-2 py-1 text-xs leading-none text-gray-400 bg-gray-100 rounded-full">{moment(nft.createdAt).format('L')}</span>
                                    <div className="flex flex-row justify-between items-center text-sm">
                                        <div>creator:</div>
                                        <div className="flex flex-row items-center space-x-3">
                                            <div className="w-7 h-7 bg-cover bg-no-repeat rounded-sm rounded-full" style={{backgroundImage: `url(${nft.identicon})`}}></div>
                                            <div>{nft.creator.substring(0, 5)}...{nft.creator.substring(nft.creator.length - 3)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </IKContext>
            </main>
        </Fragment>
    )
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