import { AppProviders } from '../app-providers'

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }]
}

export default async function FrontendLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { children } = props

  return <AppProviders>{children}</AppProviders>
}
