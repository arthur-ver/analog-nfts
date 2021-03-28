import {Fragment} from 'react'
import React, { useState, useEffect, FunctionComponent } from 'react'
import Head from 'next/head'
import { Container, Header, Footer } from '../components/Layout'
import prefixURL from '../util/prefix'
import InfiniteScroll from 'react-infinite-scroll-component'
import { INFT, IFetch } from '../util/types'

const style = {
    height: 500,
}

const Index: FunctionComponent<{items: IFetch}>  = ({ items }) => {

    const [nfts, setNFTs] = useState<Array<INFT> | []>([])
    const [cursor, setCursor] = useState<number | undefined>(undefined)
    const [EOL, setEOL] = useState<boolean>(false)

    useEffect(() => {
        if (items) {
            if (items.error) return
            let cursor_: number = items.nfts.slice(-1).pop().id + 1
            setNFTs(items.nfts)
            setCursor(cursor_)
            setEOL(false)
        }
    }, [items])

    const fetchMoreData = async () => {
        try {
            let res = await fetch(`${prefixURL}/api/fetchNFTs?cursor=${cursor}`)
            if (res.status !== 200) throw new Error('Failed to fetch')
            let items = await res.json()
            let cursor_: number = items.nfts.slice(-1).pop().id + 1
            if (items.count < cursor_) {
                setEOL(true)
            }
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
                <InfiniteScroll
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0"
                scrollThreshold="400px"
                dataLength={nfts.length}
                next={fetchMoreData}
                hasMore={!EOL}
                loader={<h4>Loading...</h4>}>
                    {nfts.map((nft, index) => (
                        <div style={style} key={index}>
                        div - #{nft.id}
                        </div>
                    ))}
                </InfiniteScroll>
            </main>
        </Fragment>
    )
}

export const getServerSideProps = async() => {

    const cursor: number = 1
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