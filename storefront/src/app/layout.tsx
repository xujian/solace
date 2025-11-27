import { getBaseURL } from '@lib/util/env'
import { Metadata } from 'next'
import { ThemeProvider } from '@modules/common/components/theme-provider'
import { Toaster } from '@lib/components/ui/sonner'
import 'styles/app.css'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {props.children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
