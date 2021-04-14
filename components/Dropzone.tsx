import {useDropzone} from 'react-dropzone'
import { Fragment } from 'react'
import { UploadIcon, PhotographIcon } from '@heroicons/react/outline'

type Props = {
    onDrop: (acceptedFiles: any) => void,
    imagePreview: any
}

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
}
  
const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
}

const img = {
    display: 'block',
    maxWidth: 'initial',
    height: '100%',
    marginLeft: '50%',
    transform: 'translateX(-50%)'
}

const Dropzone = ({ onDrop, imagePreview }: Props) => {
    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({ onDrop, accept: 'image/jpeg, image/png', maxFiles: 1 })
    const files = acceptedFiles.map(file => { return(
            <Fragment key={file.name} >
                <img id="preview-image" src={imagePreview} />
            </Fragment>
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