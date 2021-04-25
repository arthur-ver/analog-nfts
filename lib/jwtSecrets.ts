const encryption = true
const secret = process.env.JWT_SECRET
const signingKey = process.env.JWT_SIGNING_KEY
const encryptionKey = process.env.JWT_ENCRYPTION_KEY

export { encryption, secret, signingKey, encryptionKey }