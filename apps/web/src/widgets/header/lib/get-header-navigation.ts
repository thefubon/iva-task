import type { AppLocale, HeaderNavItemInput, HeaderNavSubItemInput } from '@iva360/shared'

import { resolveHeaderNavHref } from './resolve-header-nav-href'
import { hasNavItemVisibleLabel, hasNavSubItemVisibleLabel } from './header-nav-label-surface'

function filterHeaderNavSubItems(
  subItems: HeaderNavSubItemInput[] | null | undefined,
  locale: AppLocale,
): HeaderNavSubItemInput[] {
  if (!subItems?.length) {
    return []
  }

  return subItems
    .filter((subItem) => hasNavSubItemVisibleLabel(subItem))
    .filter((subItem) => resolveHeaderNavHref(subItem, locale) !== null || hasNavSubItemVisibleLabel(subItem))
}

export function getHeaderNavigation(
  items: HeaderNavItemInput[] | null | undefined,
  locale: AppLocale,
): HeaderNavItemInput[] {
  if (!items?.length) {
    return []
  }

  return items.filter((item) => hasNavItemVisibleLabel(item)).map((item) => ({
    ...item,
    subItems: filterHeaderNavSubItems(item.subItems, locale),
  }))
}
