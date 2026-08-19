import { Button } from '@/shared/ui/button'

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-muted-foreground text-sm">IVA 360 · UI Kit · FSD</p>
      <h1 className="font-heading text-4xl font-semibold tracking-tight">Чистый Next.js</h1>
      <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
        Скелет готов. Компоненты UI Kit лежат в <code className="text-foreground">src/shared/ui</code>
        , тема — в <code className="text-foreground">src/app/assets/css</code>.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button>Default</Button>
        <Button variant="meetings-primary">Meetings</Button>
        <Button variant="messenger-primary">Messenger</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </main>
  )
}
