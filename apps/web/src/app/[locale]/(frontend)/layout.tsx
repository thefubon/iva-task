import { AppProviders } from '../app-providers'

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }]
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>
}
