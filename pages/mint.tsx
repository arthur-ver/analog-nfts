import Head from 'next/head'
import { Header, Footer } from '../components/Layout'
import { Fragment, useEffect, useCallback } from 'react'
import React, { useState } from 'react'
import prefixURL from '../util/prefix'
import { useZora } from '../components/ZoraProvider'
import * as nsfwjs from 'nsfwjs'
import { Dropzone } from '../components/Dropzone'

const Mint = () => {
    const { address } = useZora()
    const [creatorShare, setCreatorShare] = useState<number>(5)
    const [loading, setLoading] = useState<boolean>(true)
    const [model, setModel] = useState<nsfwjs.NSFWJS | undefined>(undefined)
    const [imagePreview, setImagePreview] = useState<any>(undefined)

    const data = { creatorAddress: address }

    const getSignedUrl = (): Promise<any> => {
        return fetch(`${prefixURL}/api/fleekS3Auth`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data),
        })
        .then(res => res.json())
        .then(
            result => { return Promise.resolve(result) },
            error => { return Promise.reject(error) }
        )
    }

    const upload = async () => {
        getSignedUrl().then(res => console.log(res))
    }

    const nsfwCheck = async (e) => {
        e.preventDefault()
        if(imagePreview) {
            const img = document.getElementById('preview-image') as HTMLImageElement
            const predictions = await model.classify(img)
            // Share results
            console.log('Predictions: ', predictions)
        }
    }

    useEffect(() => {
        nsfwjs.load('/model/', { size: 299 }).then(model => {
            setModel(model)
            setLoading(false)
        })
    }, [])

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        const url = reader.readAsDataURL(file)
        reader.onloadend = (e) => {
            setImagePreview(reader.result)
        }
    }, [])


    return (
        <Fragment>
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
                            <form action="#" method="POST">
                                <div className="shadow sm:rounded-md sm:overflow-hidden">
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
                                                Photo
                                            </label>
                                            <Dropzone onDrop={onDrop} />
                                            <img id="preview-image" src={imagePreview} />
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
                                        <button onClick={(e) => nsfwCheck(e)} type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={loading}>
                                        Upload image
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </Fragment>
    )
}

export default Mint