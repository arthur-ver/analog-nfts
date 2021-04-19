import { ZoraProvider } from '../components/ZoraProvider'
import type { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import Router from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import 'tailwindcss/tailwind.css'

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider session={pageProps.session}>
            <ZoraProvider>
                <Component {...pageProps} />
            </ZoraProvider>
        </Provider>
    )
}