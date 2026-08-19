import type { Field } from 'payload'

import { colorField } from '@/fields/colorField'
import { validateHref } from '@/fields/validateHref'

export const LEGACY_BLOCK_ADMIN_GROUP = 'Legacy — старая CMS (prod)'

export const legacyTitleSizeOptions = [
  { label: 'По умолчанию', value: 'default' },
  { label: 'Малый', value: 'small' },
  { label: 'Средний', value: 'medium' },
  { label: 'Крупный', value: 'large' },
  { label: 'XL', value: 'xlarge' },
  { label: 'XXL', value: 'xxlarge' },
]

export const legacyHeaderLevelOptions = [
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
  { label: 'H4', value: 'h4' },
]

export const legacyHeroBgOptions = [
  { label: 'Зелёный градиент', value: 'greenGradient' },
  { label: 'Зелёный фон', value: 'greenBg' },
  { label: 'Серый фон', value: 'grayBg' },
  { label: 'Без фона', value: 'noBg' },
  { label: 'Свой цвет', value: 'customBg' },
]

export const legacyImagePositionOptions = [
  { label: 'Слева', value: 'left' },
  { label: 'Справа', value: 'right' },
]

export const legacyHeroVariationOptions = [
  { label: 'В контейнере (скруглённый)', value: 'default' },
  { label: 'На всю ширину', value: 'fullWidth' },
]

export function legacyBlockNameField(): Field {
  return {
    name: 'blockName',
    type: 'text',
    label: 'Служебное имя',
    admin: {
      description: 'Только для админки — не выводится на сайте.',
    },
  }
}

export function legacyHeroButtonField(
  name: 'primaryButton' | 'secondaryButton' | 'button',
  label: string,
): Field {
  return {
    name,
    type: 'group',
    label,
    fields: [
      {
        name: 'text',
        type: 'text',
        label: 'Текст',
        localized: true,
      },
      {
        name: 'url',
        type: 'text',
        label: 'Ссылка',
        validate: validateHref,
        admin: {
          description: 'Относительный URL или абсолютный https://…',
        },
      },
      {
        type: 'row',
        fields: [
          {
            name: 'isCustom',
            type: 'checkbox',
            label: 'Свои цвета',
            defaultValue: false,
            admin: { width: '33%' },
          },
          colorField({
            name: 'bgColor',
            label: 'Фон кнопки',
            admin: {
              width: '33%',
              condition: (_, siblingData) => Boolean(siblingData?.isCustom),
            },
          }),
          colorField({
            name: 'textColor',
            label: 'Текст кнопки',
            admin: {
              width: '33%',
              condition: (_, siblingData) => Boolean(siblingData?.isCustom),
            },
          }),
        ],
      },
    ],
  }
}
