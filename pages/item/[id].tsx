import { Fragment } from 'react'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { Header, Footer } from '../../components/Layout'
import { INFT } from '../../util/types'
import { useRouter } from 'next/router'
import safeJsonStringify from 'safe-json-stringify'
import { IKImage, IKContext } from 'imagekitio-react'
import { NFTInfo } from '../../components/NFTInfo'
import prisma from '../../lib/prisma'
import Avatars from '@dicebear/avatars'
import sprites from '@dicebear/avatars-identicon-sprites'
import DefaultErrorPage from 'next/error'

const options = { dataUri: true, background: '#ececec' }
const avatars = new Avatars(sprites, options)

const NFT = ({ nft, creatorAvatar }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter()
    
    if (router.isFallback)
        return <div>Loading...</div>
    else if (nft === null)
        return <>
            <Head>
                <meta name="robots" content="noindex" />
            </Head>
            <DefaultErrorPage statusCode={404} />
        </>
    else
        return(
            <Fragment>
                <Head>
                    <title>ANALOG NFTs – {nft.title}</title>
                </Head>
                <Header />
                <main className="container mx-auto px-4 py-24 space-y-32">
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div>
                            <IKContext urlEndpoint={`https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IK_CONTEXT}/`}>
                                <IKImage className="w-full" 
                                    path={nft.photoCDN}
                                    loading="lazy"
                                    lqip={{ active: true, blur: 10 }} />
                            </IKContext>
                        </div>
                        <div className="prose space-y-12">
                            <div className="space-y-8">
                                <div className="space-y-4 pt-12">
                                    <h1>{nft.title}</h1>
                                    <p className="text-gray-400">{nft.description}</p>
                                </div>
                            </div>
                            <NFTInfo nft={nft} creatorAvatar={creatorAvatar} />
                        </div>
                    </section>
                </main>
            </Fragment>
        )
}

export const getStaticPaths = async () => {
    const query = async () => {
        const tokens = await prisma.nft.findMany({
            select: { tokenId: true, },
        })

        const paths = tokens.map((token) => ({
            params: { id: token.tokenId.toString() },
        }))

        return { paths, fallback: true }
    }

    return query()
            .catch(e => { throw e })
            .finally(async () => {
                if(process.env.NODE_ENV == 'development')
                    await prisma.$disconnect()
            })
}

export const getStaticProps = async ({ params }) => {    
    const query = async () => {
        let nft: INFT | null = null
        let creatorAvatar: string | null = null

        if (!/^\d+$/.test(params.id))                   // Check if params.id is a valid number
            return { props: { nft, creatorAvatar } }

        const fetchedObj = await prisma.nft.findMany({
            where: { tokenId: Number(params.id) },
        })

        if (fetchedObj.length === 0)
            return { props: { nft, creatorAvatar } }

        const stringifiedData = safeJsonStringify(fetchedObj[0])
        
        nft = JSON.parse(stringifiedData)
        creatorAvatar = avatars.create(nft.creator)

        return { props: { nft, creatorAvatar } }
    }

    return query()
            .catch(e => { throw e })
            .finally(async () => {
                if(process.env.NODE_ENV == 'development')
                    await prisma.$disconnect()
            })
}

export default NFT
