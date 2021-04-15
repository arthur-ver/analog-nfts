import prefixURL from '../util/prefix'

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
        const jsonResponse = await response.json()
        return jsonResponse.url
    } catch (e) {
        return e
    }
}

const uploadFile = async (file: File, signedRequest: any) => {
    const response = await fetch(signedRequest, {
        headers: {
            'Content-Type': file.type
        },
        method: 'PUT',
        body: file
    })
    return response
}

export { getSignedUrl, uploadFile }