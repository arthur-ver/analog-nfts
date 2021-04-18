import { verifyAuthRequest } from '../lib/helpers'
import Head from 'next/head'
import { Header, Footer } from '../components/Layout'
import React, { useState, useEffect, useCallback } from 'react'
import { useZora } from '../components/ZoraProvider'
import * as nsfwjs from 'nsfwjs'
import { Dropzone } from '../components/Dropzone'
import { getFileExtension, getSignedUrl, uploadFile, uploadToImagekit } from '../lib/helpers'
import NProgress from 'nprogress'
import { XIcon } from '@heroicons/react/outline'
import DefaultErrorPage from 'next/error'
import { SignedResponse } from '../util/types'
import { CircleSpinner } from 'react-spinners-kit'

const Mint = ({ status, userId, authToken, refreshTokenHash }) => {
    const { address, handleAuthTokensChanged } = useZora()
    const [creatorShare, setCreatorShare] = useState<number>(5)
    const [disableBtn, setDisableBtn] = useState<boolean>(true)
    const [uploading, setUploading] = useState<boolean>(false)
    const [imagePreview, setImagePreview] = useState<any>(undefined)
    const [file, setFile] = useState<File | undefined>(undefined)

    useEffect(() => {
        if (status !== 400) {
            handleAuthTokensChanged(userId, authToken, refreshTokenHash)
        }
    }, [handleAuthTokensChanged, status, userId, authToken, refreshTokenHash])

    const upload = async (e) => {
        e.preventDefault()
        NProgress.start()
        setDisableBtn(true)
        setUploading(true)
        try {
            const predictions = await nsfwCheck()
            if (predictions[0].probability > 0.65) {
                const signedResponse: SignedResponse = await getSignedUrl(address, file.type)
                const uploadResponse: Response = await uploadFile(file, signedResponse.url)
                const cid_v0 = uploadResponse.headers.get('x-fleek-ipfs-hash-v0')
                const s3FileUrl = signedResponse.key
                const s3FileName = signedResponse.fileName
                const fileExtension = getFileExtension(file.name)
                const imagekitResponse = await uploadToImagekit(s3FileUrl, s3FileName, fileExtension)
                console.log(imagekitResponse, cid_v0)
            }
        } catch (e) {
            console.error(e)
        } finally {
            NProgress.done()
            setDisableBtn(false)
            setUploading(false)
        }
    }

    const nsfwCheck = async () => {
        const model = await nsfwjs.load('/model/', { size: 299 })
            const img = document.getElementById('preview-image') as HTMLImageElement
            const predictions = await model.classify(img)
            return predictions
    }

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length == 0) return
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e) => {
            setImagePreview(reader.result)
            setDisableBtn(false)
        }
        setFile(file)
    }, [])

    const resetFile = () => {
        setImagePreview(undefined)
        setFile(undefined)
    }

    if (status === 400)
        return <>
            <Head>
                <meta name="robots" content="noindex" />
            </Head>
            <DefaultErrorPage statusCode={400} title='Unauthorized' />
        </>
    else
        return <>
                <Head>
                    <title>ANALOG NFTs – Mint new NFT</title>
                </Head>
                <Header />
                <main className="container mx-auto px-4 py-24 space-y-32">
                    <div>
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="md:col-span-1 prose max-w-full">
                                <div className="px-4 sm:px-0">
                                    <h3>Mint your NFT</h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                    This information will be publicly stored on the blockchain. Please do not enter any personal information.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 md:mt-0 md:col-span-2">
                                <div className="shadow sm:rounded-md sm:overflow-hidden">
                                    <div className="p-0 bg-white relative">
                                        <div className={`${uploading ? 'opacity-60' : ''} relative`}>
                                            <Dropzone onDrop={onDrop} imagePreview={imagePreview} />
                                            {imagePreview &&
                                                <button onClick={() => resetFile()} disabled={disableBtn} className='rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 absolute top-2 left-2 p-1'>
                                                    <XIcon className="w-4 h-4 text-white" />
                                                </button>
                                            }
                                        </div>
                                        {uploading &&
                                            <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
                                                <CircleSpinner color='#4e46e5' />
                                            </div>
                                        }
                                    </div>
                                    <div className="px-4 py-3 bg-gray-50 text-right ">
                                        <button onClick={(e) => upload(e)} disabled={disableBtn} type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                        Upload image
                                        </button>
                                    </div>
                                </div>

                                <div className="shadow sm:rounded-md sm:overflow-hidden hidden">
                                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                            <input type="text" name="title" id="title" maxLength={60} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <div className="mt-1">
                                                <textarea id="description" name="description" maxLength={255} rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Brief description for your NFT"></textarea>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Max 255 characters.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Creator share on sell (%)
                                            </label>
                                            <div className="mt-1 space-x-2">
                                                <button onClick={(e) => setCreatorShare(5)} type="button" className={`bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${creatorShare == 5 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-gray-700'}`}>5</button>
                                                <button onClick={(e) => setCreatorShare(10)} type="button" className={`bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${creatorShare == 10 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-gray-700'}`}>10</button>
                                                <button onClick={(e) => setCreatorShare(15)} type="button" className={`bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${creatorShare == 15 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-gray-700'}`}>15</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                        Upload image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </>
}

export const getServerSideProps = async({ query: { userId, authToken, refreshTokenHash } }) => {
    if (userId !== undefined && authToken !== undefined && refreshTokenHash !== undefined) {
        const authResponse = await verifyAuthRequest(userId, authToken, refreshTokenHash)
        if (authResponse.status === 400) {
            return { props: { status: 400 } }
        } else {
            return { props: { 
                status: 200,
                userId: authResponse.response.userId,
                authToken: authResponse.response.authToken,
                refreshTokenHash: authResponse.response.refreshTokenHash
            }}
        }
    } else {
        return { props: { status: 400 } }
    }
}

export default Mint