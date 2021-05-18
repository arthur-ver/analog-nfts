import prefixURL from '../util/prefix'
import { authResponse } from '../util/types'

const getFileExtension = (filename: string) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

const getSignedUrl = async (contentType: string) => {
    try {
        const response = await fetch(`${prefixURL}/api/getPresignedUrl`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ 
                contentType
            }),
        })
        if (response.status == 200) {
            const jsonResponse = await response.json()
            return jsonResponse
        } else {
            throw { getSignedUrl: true }
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
            throw { uploadFile: true }
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
            throw { uploadToImagekit: true }
        }
    } catch (e) {
        throw e
    }
}

const createDraft = async (photoCID: string, photoCDN: string, photoCDNid: string, photoS3: string) => {
    try {
        const response = await fetch(`${prefixURL}/api/saveDraft`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ 
                photoCID,
                photoCDN,
                photoCDNid,
                photoS3
            }),
        })
        if (response.status == 200) {
            const jsonResponse = await response.json()
            return jsonResponse
        } else {
            throw { createDraft: true }
        }
    } catch (e) {
        throw  e
    }
}

const deleteDraft = async(id: string) => {
    try {
        const response = await fetch(`${prefixURL}/api/deleteDraft`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                id
            }),
        })
        if (response.status == 200) {
            const jsonResponse = await response.json()
            return jsonResponse
        } else {
            throw { deleteDraft: true }
        }
    } catch (e) {
        throw e
    }
}

const sha256 = async (url: string) => {
    try {
        const response = await fetch(`${prefixURL}/api/sha256`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                url
            }),
        })
        if (response.status == 200) {
            const jsonResponse = await response.json()
            return jsonResponse.hash
        } else {
            throw { sha256: true }
        }
    } catch (e) {
        throw e
    }
}

export { getFileExtension, getSignedUrl, uploadFile, uploadToImagekit, createDraft, deleteDraft, sha256 }