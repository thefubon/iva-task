#!/usr/bin/env node
/**
 * Заполняет demo CMS (Header, HomePage, логотип) через REST.
 * Нужны запущенные CMS и MinIO. После этого: pnpm db:backup
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cmsUrl = process.env.CMS_INTERNAL_URL ?? 'http://localhost:3333'
const email = process.env.CMS_SEED_EMAIL ?? 'admin@iva360.ru'
const password = process.env.CMS_SEED_PASSWORD ?? 'admin'
const logoPath = path.join(root, 'scripts/seed-assets/iva360-logo.svg')

function lexicalParagraph(text) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'text',
              version: 1,
              text,
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
            },
          ],
        },
      ],
    },
  }
}

async function login() {
  const response = await fetch(`${cmsUrl}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await response.json()
  if (!response.ok || !json.token) {
    throw new Error(`Login failed: ${response.status} ${JSON.stringify(json)}`)
  }
  return json.token
}

async function uploadLogo(token) {
  const svg = fs.readFileSync(logoPath)
  const form = new FormData()
  form.append('file', new Blob([svg], { type: 'image/svg+xml' }), 'iva360-logo.svg')
  form.append('_payload', JSON.stringify({ alt: 'IVA 360' }))

  const response = await fetch(`${cmsUrl}/api/media?locale=ru`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  const json = await response.json()
  if (!response.ok || !json.doc?.id) {
    throw new Error(`Media upload failed: ${response.status} ${JSON.stringify(json)}`)
  }
  return json.doc.id
}

async function updateGlobal(token, slug, data, locale) {
  const response = await fetch(`${cmsUrl}/api/globals/${slug}?locale=${locale}`, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const json = await response.json()
  if (!response.ok) {
    throw new Error(`Update ${slug} (${locale}) failed: ${response.status} ${JSON.stringify(json)}`)
  }
}

const headerRu = (logoId) => ({
  siteName: 'IVA 360',
  logo: logoId,
  authButtons: {
    loginDesktop: 'Войти',
    signupDesktop: 'Регистрация',
    loginMobile: 'Вход',
    signupMobile: 'Регистрация',
  },
  navigation: [
    { label: 'Главная', url: '/', openInNewTab: false },
    {
      label: 'Продукты',
      url: '#',
      openInNewTab: false,
      subItems: [
        {
          label: 'IVA Meetings',
          url: '#meetings',
          description: 'Видеоконференции для бизнеса',
          openInNewTab: false,
        },
        {
          label: 'IVA Messenger',
          url: '#messenger',
          description: 'Корпоративный мессенджер',
          openInNewTab: false,
        },
      ],
    },
    { label: 'CMS', url: '/admin', openInNewTab: false },
  ],
  phones: [
    {
      number: '+7 (495) 000-00-00',
      url: 'tel:+74950000000',
      iconType: 'hugeicons',
      hugeiconsName: 'Call02Icon',
      openInNewTab: false,
    },
  ],
  rightLinks: [
    {
      number: 'Поддержка',
      url: 'mailto:admin@iva360.ru',
      iconType: 'hugeicons',
      hugeiconsName: 'CustomerSupportIcon',
      openInNewTab: false,
    },
  ],
})

const headerEn = (logoId) => ({
  siteName: 'IVA 360',
  logo: logoId,
  authButtons: {
    loginDesktop: 'Log in',
    signupDesktop: 'Sign up',
    loginMobile: 'Log in',
    signupMobile: 'Sign up',
  },
  navigation: [
    { label: 'Home', url: '/', openInNewTab: false },
    {
      label: 'Products',
      url: '#',
      openInNewTab: false,
      subItems: [
        {
          label: 'IVA Meetings',
          url: '#meetings',
          description: 'Business video conferencing',
          openInNewTab: false,
        },
        {
          label: 'IVA Messenger',
          url: '#messenger',
          description: 'Corporate messenger',
          openInNewTab: false,
        },
      ],
    },
    { label: 'CMS', url: '/admin', openInNewTab: false },
  ],
  phones: [
    {
      number: '+7 (495) 000-00-00',
      url: 'tel:+74950000000',
      iconType: 'hugeicons',
      hugeiconsName: 'Call02Icon',
      openInNewTab: false,
    },
  ],
  rightLinks: [
    {
      number: 'Support',
      url: 'mailto:admin@iva360.ru',
      iconType: 'hugeicons',
      hugeiconsName: 'CustomerSupportIcon',
      openInNewTab: false,
    },
  ],
})

const homeRu = {
  title: 'IVA 360',
  showTitle: false,
  blocks: [
    {
      blockType: 'legacyHero',
      blockName: 'Hero',
      title: 'IVA 360',
      bgType: 'greenGradient',
      variation: 'default',
      imagePosition: 'right',
      titleSize: 'xlarge',
      headerLevel: 'h1',
      titleTheme: 'default',
      description: lexicalParagraph(
        'Демо-стенд тестового задания: Next.js, Payload CMS, UI Kit и данные из seed-дампа.',
      ),
      primaryButton: { text: 'Открыть CMS', url: '/admin', isCustom: false },
      secondaryButton: { text: 'Главная', url: '/', isCustom: false },
    },
  ],
}

const homeEn = {
  title: 'IVA 360',
  showTitle: false,
  blocks: [
    {
      blockType: 'legacyHero',
      blockName: 'Hero',
      title: 'IVA 360',
      bgType: 'greenGradient',
      variation: 'default',
      imagePosition: 'right',
      titleSize: 'xlarge',
      headerLevel: 'h1',
      titleTheme: 'default',
      description: lexicalParagraph(
        'Hiring-task demo: Next.js, Payload CMS, UI Kit, and seed data restored on first install.',
      ),
      primaryButton: { text: 'Open CMS', url: '/admin', isCustom: false },
      secondaryButton: { text: 'Home', url: '/', isCustom: false },
    },
  ],
}

const token = await login()
const logoId = await uploadLogo(token)
await updateGlobal(token, 'header', headerRu(logoId), 'ru')
await updateGlobal(token, 'header', headerEn(logoId), 'en')
await updateGlobal(token, 'homePage', homeRu, 'ru')
await updateGlobal(token, 'homePage', homeEn, 'en')
console.log(`✓ Seeded Header + HomePage + logo (${logoId})`)
