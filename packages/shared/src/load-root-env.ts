import { config as loadEnv } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

let loaded = false

/**
 * Load monorepo root env once (apps live under `apps/*`).
 *
 * Приоритет (как у Next.js): реальные переменные процесса > `.env.local` > `.env`.
 */
export function loadRootEnv(): void {
  if (loaded) return

  const here = path.dirname(fileURLToPath(import.meta.url))
  const root = path.resolve(here, '../../..')
  const envPath = path.join(root, '.env')
  const envLocalPath = path.join(root, '.env.local')

  if (fs.existsSync(envLocalPath)) {
    loadEnv({ path: envLocalPath })
  }
  if (fs.existsSync(envPath)) {
    loadEnv({ path: envPath })
  }
  loaded = true
}
