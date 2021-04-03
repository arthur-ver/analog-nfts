import { Fragment } from 'react'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { Header, Footer } from '../../components/Layout'
import { IFetch, INFT } from '../../util/types'
import { PrismaClient } from '@prisma/client'
import { useRouter } from 'next/router'
import safeJsonStringify from 'safe-json-stringify'
import { IKImage, IKContext } from 'imagekitio-react'

const NFT = ({ nft }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter()

    if (router.isFallback)
        return <div>Loading...</div>
    else
        return(
            <Fragment>
                <Head>
                    <title>ANALOG NFTs</title>
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
                    </section>
                </main>
            </Fragment>
        )
}

export const getStaticPaths = async () => {
    const prisma = new PrismaClient()

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
                await prisma.$disconnect()
            })
}

export const getStaticProps = async ({ params }) => {
    const prisma = new PrismaClient()
    
    const query = async () => {
        const fetchedObj = await prisma.nft.findMany({
            where: { tokenId: Number(params.id) },
        })

        const stringifiedData = safeJsonStringify(fetchedObj[0]);
        const nft: INFT = JSON.parse(stringifiedData);

        return { props: { nft } }
    }

    return query()
            .catch(e => { throw e })
            .finally(async () => {
                await prisma.$disconnect()
            })
}

export default NFT