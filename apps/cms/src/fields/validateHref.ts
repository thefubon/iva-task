import { isSafeHref } from '@iva360/shared'

/**
 * Валидация URL-полей Payload: запрещает небезопасные схемы (`javascript:`,
 * `data:`, `vbscript:`) и протокол-относительные `//host`. Разрешены
 * http(s), mailto, tel и относительные (same-origin) пути.
 */
export const validateHref = (value?: string | null): true | string => {
  if (value == null || value === '') {
    return true
  }

  return isSafeHref(value)
    ? true
    : 'Недопустимый URL. Разрешены только http(s), mailto, tel и относительные пути (например, /about).'
}
