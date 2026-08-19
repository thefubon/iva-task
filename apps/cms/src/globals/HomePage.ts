import type { GlobalConfig } from 'payload'

import { pageLayoutBlocks } from '../blocks/pageLayoutBlocks'

export const HomePage: GlobalConfig = {
  slug: 'homePage',
  label: 'Главная',
  admin: {
    group: 'Основные',
  },
  lockDocuments: false,
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Заголовок страницы',
              localized: true,
              admin: {
                description: 'Резервный заголовок для метаданных и H1, если блок Hero не задан.',
              },
            },
            {
              name: 'showTitle',
              type: 'checkbox',
              label: 'Отображать заголовок (H1) на странице',
              defaultValue: false,
              admin: {
                description:
                  'Если включено — заголовок выводится крупным H1 над блоками. По умолчанию выключено.',
              },
            },
          ],
        },
        {
          label: 'Контент',
          fields: [
            {
              name: 'blocks',
              type: 'blocks',
              label: 'Блоки страницы',
              blocks: pageLayoutBlocks,
            },
          ],
        },
      ],
    },
  ],
}
