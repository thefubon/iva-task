import type { Field } from 'payload'

import { validateHref } from './validateHref'

type CreateNavLinkFieldsOptions = {
  urlAdminDescription?: string
}

/** Demo: только ручной URL, без коллекции Pages. */
export function createNavLinkFields(options: CreateNavLinkFieldsOptions = {}): Field[] {
  const {
    urlAdminDescription = 'Относительный (/about) или абсолютный (https://…) URL.',
  } = options

  return [
    {
      name: 'url',
      type: 'text',
      label: 'URL',
      validate: validateHref,
      admin: {
        description: urlAdminDescription,
      },
    },
  ]
}
