import { getBaseURL } from '@lib/util/env'
import { Metadata } from 'next'
import 'styles/globals.css'
import { ThemeProvider } from '@modules/common/components/theme-provider'
import { Toaster } from '@lib/components/ui/sonner'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <main className='relative'>{props.children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
