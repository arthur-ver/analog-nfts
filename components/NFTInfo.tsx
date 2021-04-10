import { INFT } from '../util/types'
import moment from 'moment'
import { PhotographIcon, DocumentIcon } from '@heroicons/react/outline'

const NFTInfo = ({ nft, creatorAvatar }: { nft: INFT, creatorAvatar: string }) => {

    console.log("..........", nft)

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-t border-gray-200">
                <dl>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                    Creator:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        <div className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                        <div className="w-7 h-7 bg-cover bg-no-repeat rounded-sm rounded-full" style={{backgroundImage: `url(${creatorAvatar})`}}></div>
                            <span className="ml-2 flex-1 w-0 truncate">
                            { nft.creator }
                            </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <a href={`https://ipfs.io/ipfs/${encodeURIComponent(nft.photoCID)}`}  target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500">Etherscan</a>
                        </div>
                        </div>
                    </div>
                    </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                    Minted:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { moment(nft.createdAt).format('L') }
                    </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                    IPFS URIs
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        <div className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                            <PhotographIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                            <span className="ml-2 flex-1 w-0 truncate">
                            { nft.photoCID }
                            </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <a href={`https://ipfs.io/ipfs/${encodeURIComponent(nft.photoCID)}`}  target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500">View</a>
                        </div>
                        </div>
                        <div className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                            <DocumentIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                            <span className="ml-2 flex-1 w-0 truncate">
                            { nft.metadataCID }
                            </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <a href={`https://ipfs.io/ipfs/${encodeURIComponent(nft.metadataCID)}`} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500">View</a>
                        </div>
                        </div>
                    </div>
                    </dd>
                </div>
                </dl>
            </div>
        </div>
    )
}

export { NFTInfo }