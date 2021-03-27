import { ZoraProvider } from '../components/ZoraProvider'
import type { AppProps } from 'next/app'

import 'tailwindcss/tailwind.css'

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ZoraProvider><Component {...pageProps} /></ZoraProvider>
    )
}