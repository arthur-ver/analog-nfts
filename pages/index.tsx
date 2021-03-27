import Link from 'next/link'
import {Fragment} from 'react'
import Head from 'next/head'
import { Container, Header, Footer } from '../components/Layout'
import prefixURL from '../util/prefix'

export default function Index({ items }) {
    return (
        <Fragment>
            <Head>
                <title>ANALOG NFTs</title>
            </Head>
            <Header />
            <main>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {items.map((item, idx) => (
                    <Link key={idx} href={`/item/${encodeURIComponent(item.id)}`}>
                        <a className="block hover:text-blue-500"></a>
                    </Link>
                    ))}
                </section>
            </main>
        </Fragment>
    )
}

export async function getServerSideProps() {
    const res = await fetch(`${prefixURL}/api/fetchNFTs`)
    const json = await res.json()
    const items = await json.nfts
    
    return { props: { items } }
}