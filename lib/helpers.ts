import prefixURL from '../util/prefix'
import { authResponse } from '../util/types'

const getFileExtension = (filename: string) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

const getSignedUrl = async (address: string, contentType: string) => {
    try {
        const response = await fetch(`${prefixURL}/api/getPresignedUrl`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ 
                creatorAddress: address,
                contentType: contentType
            }),
        })
        if (response.status == 200) {
            const jsonResponse = await response.json()
            return jsonResponse
        } else {
            throw 'getSignedUrl: Bad Request'
        }
    } catch (e) {
        throw e
    }
}

const uploadFile = async (file: File, signedRequest: any) => {
    try {
        const response = await fetch(signedRequest, {
            headers: {
                'Content-Type': file.type
            },
            method: 'PUT',
            body: file
        })
        if (response.status == 200) {
            return response
        } else {
            throw 'uploadFile: Bad Request'
        }
    } catch (e) {
        throw e
    }
}

const uploadToImagekit = async (url: string, fileName: string, fileExtension: string) => {
    try {
        const response = await fetch(`${prefixURL}/api/uploadToImagekit`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ 
                url,
                fileName,
                fileExtension
            }),
        })
        if (response.status == 200) {
            const jsonResponse = await response.json()
            return jsonResponse
        } else {
            throw 'uploadToImagekit: Bad Request'
        }
    } catch (e) {
        throw e
    }
}

export { getFileExtension, getSignedUrl, uploadFile, uploadToImagekit }