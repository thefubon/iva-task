import type { ArrayField, Field } from 'payload'

import { createNavLinkFields } from './linkFields'

export const headerNavSubItemFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'icon',
        type: 'upload',
        relationTo: 'media',
        label: 'Иконка (десктоп)',
        admin: {
          width: '50%',
          description: 'Мега-меню на больших экранах.',
        },
      },
      {
        name: 'mobileIcon',
        type: 'upload',
        relationTo: 'media',
        label: 'Иконка (мобильное меню)',
        admin: {
          width: '50%',
          description: 'Если пусто — используется иконка для десктопа.',
        },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Название (десктоп)',
        required: true,
        localized: true,
        admin: { width: '50%' },
      },
      {
        name: 'mobileLabel',
        type: 'text',
        label: 'Название (мобильное меню)',
        localized: true,
        admin: {
          width: '50%',
          description: 'Если пусто — используется название для десктопа.',
        },
      },
    ],
  },
  ...createNavLinkFields(),
  {
    name: 'openInNewTab',
    type: 'checkbox',
    label: 'Открыть в новом окне',
    defaultValue: false,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Описание',
    localized: true,
  },
  {
    type: 'row',
    fields: [
      {
        name: 'hoverBackground',
        type: 'text',
        label: 'Фон при наведении',
        admin: {
          width: '50%',
          description: 'Hex, например #E8F5F0',
        },
      },
      {
        name: 'titleColor',
        type: 'text',
        label: 'Цвет заголовка',
        admin: {
          width: '50%',
          description: 'Hex при наведении / активной странице',
        },
      },
    ],
  },
]

export const headerNavigationItemFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'icon',
        type: 'upload',
        relationTo: 'media',
        label: 'Иконка (десктоп)',
        admin: { width: '50%' },
      },
      {
        name: 'mobileIcon',
        type: 'upload',
        relationTo: 'media',
        label: 'Иконка (мобильное меню)',
        admin: {
          width: '50%',
          description: 'Если пусто — используется иконка для десктопа.',
        },
      },
    ],
  },
  {
    name: 'mobileMenuOnly',
    type: 'checkbox',
    label: 'Только мобильная иконка',
    defaultValue: false,
    admin: {
      description: 'Если включено, иконка десктопа не показывается в шапке на больших экранах.',
    },
  },
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Название (десктоп)',
        required: true,
        localized: true,
        admin: { width: '50%' },
      },
      {
        name: 'mobileLabel',
        type: 'text',
        label: 'Название (мобильное меню)',
        localized: true,
        admin: { width: '50%' },
      },
    ],
  },
  ...createNavLinkFields({
    urlAdminDescription: 'Необязательно, если добавлено подменю.',
  }),
  {
    name: 'openInNewTab',
    type: 'checkbox',
    label: 'Открыть в новом окне',
    defaultValue: false,
  },
  {
    name: 'subItems',
    type: 'array',
    label: 'Подменю',
    labels: {
      singular: 'Подпункт',
      plural: 'Подпункты',
    },
    admin: {
      initCollapsed: true,
      description: 'Если добавлены подпункты, пункт отображается как мега-меню.',
    },
    fields: headerNavSubItemFields,
  },
]

export function createHeaderNavigationField(): ArrayField {
  return {
    name: 'navigation',
    type: 'array',
    label: 'Навигация',
    labels: {
      singular: 'Пункт меню',
      plural: 'Пункты меню',
    },
    admin: {
      initCollapsed: true,
      description:
        'Основное меню шапки. Для десктопа и мобильного меню можно задать разные названия и иконки.',
    },
    fields: headerNavigationItemFields,
  }
}
