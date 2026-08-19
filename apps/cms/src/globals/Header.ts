import type { GlobalConfig } from 'payload'

import { createHeaderNavigationField } from '../fields/headerNavigationFields'
import { createTopbarLinkArrayField } from '../fields/topbarLinkFields'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Шапка',
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
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Логотип',
            },
            {
              name: 'siteName',
              type: 'text',
              label: 'Название сайта',
              localized: true,
            },
            {
              name: 'authButtons',
              type: 'group',
              label: 'Кнопки входа и регистрации',
              admin: {
                description:
                  'Подписи кнопок в шапке. Пустое поле — дефолт на сайте (десктоп: «Войти» / «Регистрация», мобила: «Вход» / «Регистрация»).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'loginDesktop',
                      type: 'text',
                      label: 'Войти — десктоп',
                      localized: true,
                      defaultValue: 'Войти',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'signupDesktop',
                      type: 'text',
                      label: 'Регистрация — десктоп',
                      localized: true,
                      defaultValue: 'Регистрация',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'loginMobile',
                      type: 'text',
                      label: 'Войти — мобила',
                      localized: true,
                      defaultValue: 'Вход',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'signupMobile',
                      type: 'text',
                      label: 'Регистрация — мобила',
                      localized: true,
                      defaultValue: 'Регистрация',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Навигация',
          fields: [createHeaderNavigationField()],
        },
        {
          label: 'Топбар',
          fields: [
            createTopbarLinkArrayField({
              name: 'phones',
              label: 'Слева',
              description: 'Список ссылок с подписями и иконками (tel:, mailto:, https: и т.д.).',
            }),
            createTopbarLinkArrayField({
              name: 'rightLinks',
              label: 'Справа',
              defaultHugeiconsName: 'CustomerSupportIcon',
              description: 'Список ссылок с подписями и иконками (tel:, mailto:, https: и т.д.).',
            }),
          ],
        },
      ],
    },
  ],
}
