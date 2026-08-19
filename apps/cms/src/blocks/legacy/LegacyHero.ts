import type { Block } from 'payload'

import {
  LEGACY_BLOCK_ADMIN_GROUP,
  legacyBlockNameField,
  legacyHeaderLevelOptions,
  legacyHeroBgOptions,
  legacyHeroButtonField,
  legacyHeroVariationOptions,
  legacyImagePositionOptions,
  legacyTitleSizeOptions,
} from './fields/legacy-fields'

export const LegacyHeroBlock: Block = {
  slug: 'legacyHero',
  imageAltText: 'Hero-Блок — старая CMS',
  labels: {
    singular: 'Legacy: Hero-Блок',
    plural: 'Legacy: Hero-Блок',
  },
  admin: {
    group: LEGACY_BLOCK_ADMIN_GROUP,
  },
  fields: [
    legacyBlockNameField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Контент',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Заголовок',
              required: true,
              localized: true,
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка продукта',
              options: [
                { label: '—', value: 'none' },
                { label: 'IVA Meet', value: 'iva-c-meet' },
                { label: 'IVA Webinar', value: 'iva-c-webinar' },
                { label: 'IVA Chat', value: 'iva-c-chat' },
                { label: 'IVA Mail', value: 'iva-c-mail' },
                { label: 'IVA Disk', value: 'iva-c-disk' },
                { label: 'IVA AI', value: 'iva-c-ai' },
                { label: 'IVA Stream', value: 'iva-c-stream' },
                { label: 'IVA Calendar', value: 'iva-c-calendar' },
                { label: 'IVA Users', value: 'iva-c-users' },
                { label: 'Смартфон / монитор', value: 'monitor-smartphone' },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Описание',
              localized: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Картинка',
            },
          ],
        },
        {
          label: 'Оформление',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'bgType',
                  type: 'select',
                  label: 'Фон',
                  defaultValue: 'grayBg',
                  options: legacyHeroBgOptions,
                  admin: { width: '50%' },
                },
                {
                  name: 'variation',
                  type: 'select',
                  label: 'Ширина блока',
                  defaultValue: 'default',
                  options: legacyHeroVariationOptions,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'imagePosition',
                  type: 'select',
                  label: 'Картинка',
                  defaultValue: 'right',
                  options: legacyImagePositionOptions,
                  admin: { width: '50%' },
                },
                {
                  name: 'titleSize',
                  type: 'select',
                  label: 'Размер заголовка',
                  defaultValue: 'xlarge',
                  options: legacyTitleSizeOptions,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'headerLevel',
                  type: 'select',
                  label: 'Уровень заголовка',
                  defaultValue: 'h1',
                  options: legacyHeaderLevelOptions,
                  admin: { width: '50%' },
                },
                {
                  name: 'titleTheme',
                  type: 'text',
                  label: 'Тема иконки (prod)',
                  defaultValue: 'default',
                  admin: {
                    width: '50%',
                    description: 'default, green, blue, red, yellow, violet…',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'blockBgColor',
                  type: 'text',
                  label: 'Цвет фона (customBg)',
                  admin: {
                    width: '50%',
                    description: 'Hex, если фон = «Свой цвет».',
                  },
                },
                {
                  name: 'blockTextColor',
                  type: 'text',
                  label: 'Цвет текста (customBg)',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Кнопки',
          fields: [
            legacyHeroButtonField('primaryButton', 'Основная кнопка'),
            legacyHeroButtonField('secondaryButton', 'Вторая кнопка'),
          ],
        },
      ],
    },
  ],
}
