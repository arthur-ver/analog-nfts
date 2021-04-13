import {useDropzone} from 'react-dropzone'
import { Fragment } from 'react'
import { UploadIcon, PhotographIcon } from '@heroicons/react/outline'

type Props = {
    onDrop: (acceptedFiles: any) => void
}

const Dropzone = ({ onDrop }: Props) => {
    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({ onDrop, accept: 'image/jpeg, image/png', maxFiles: 1 })
    const files = acceptedFiles.map(file => { return(
            <li key={file.name} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                    <PhotographIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <span className="ml-2 flex-1 w-0 truncate">
                    { file.name }
                    </span>
                </div>
            </li>
        )
    })
    
    return (
        <Fragment>
            <div {...getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${isDragActive ? 'bg-blue-50' : 'bg-grey-100'}`}>
                <div className="space-y-1 text-center">
                <UploadIcon className="stroke-0 mx-auto h-8 w-8 text-gray-300" />
                <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input {...getInputProps()} id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                    PNG or JPG up to 5MB
                </p>
                </div>
            </div>
            <div>{files}</div>
        </Fragment>
    )
}

export { Dropzone }