import type { ArrayField, Field } from 'payload'

import { validateHref } from './validateHref'

export const topbarLinkItemFields: Field[] = [
  {
    name: 'number',
    type: 'text',
    label: 'Подпись',
    required: true,
    localized: true,
  },
  {
    name: 'url',
    type: 'text',
    label: 'URL',
    validate: validateHref,
    admin: {
      description: 'Необязательно. Например: tel:+74951234567, mailto:info@example.com или https://…',
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox',
    label: 'Открыть в новом окне',
    defaultValue: false,
  },
  {
    name: 'iconType',
    type: 'select',
    label: 'Иконка',
    defaultValue: 'hugeicons',
    options: [
      { label: 'Hugeicons', value: 'hugeicons' },
      { label: 'Своя иконка', value: 'custom' },
      { label: 'Без иконки', value: 'none' },
    ],
  },
  {
    name: 'hugeiconsName',
    type: 'text',
    label: 'Иконка Hugeicons',
    defaultValue: 'Call02Icon',
    admin: {
      description: 'Имя из @hugeicons/core-free-icons, например Call02Icon или CustomerSupportIcon.',
      condition: (_, siblingData) => siblingData?.iconType === 'hugeicons',
    },
  },
  {
    name: 'customIcon',
    type: 'upload',
    relationTo: 'media',
    label: 'Своя иконка',
    admin: {
      description: 'Загрузите SVG или изображение. Файл уходит в MinIO.',
      condition: (_, siblingData) => siblingData?.iconType === 'custom',
    },
  },
]

type TopbarLinkArrayFieldOptions = {
  name: string
  label: string
  description?: string
  defaultHugeiconsName?: string
}

function createTopbarLinkItemFields(defaultHugeiconsName: string): Field[] {
  return topbarLinkItemFields.map((field) => {
    if (field.type === 'text' && field.name === 'hugeiconsName') {
      return {
        ...field,
        defaultValue: defaultHugeiconsName,
      }
    }

    return field
  })
}

export function createTopbarLinkArrayField({
  name,
  label,
  description,
  defaultHugeiconsName = 'Call02Icon',
}: TopbarLinkArrayFieldOptions): ArrayField {
  return {
    name,
    type: 'array',
    label,
    labels: {
      singular: 'Ссылка',
      plural: 'Ссылки',
    },
    admin: {
      initCollapsed: true,
      description,
    },
    fields: createTopbarLinkItemFields(defaultHugeiconsName),
  }
}
