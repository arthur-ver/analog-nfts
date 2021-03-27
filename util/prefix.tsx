const isProd = process.env.NODE_ENV === 'production'
const prefixURL = isProd ? 'https://analog-next.vercel.app' : 'http://localhost:3000'

export default prefixURL