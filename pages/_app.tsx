import { ZoraProvider } from '../components/ZoraProvider'
import type { AppProps } from 'next/app'

import 'tailwindcss/tailwind.css'

const MyApp = ({ Component, pageProps }: AppProps) => <ZoraProvider><Component {...pageProps} /></ZoraProvider>

export default MyApp