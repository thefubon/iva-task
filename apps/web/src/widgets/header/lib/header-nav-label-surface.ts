import type { HeaderNavItemInput, HeaderNavSubItemInput } from '@iva360/shared'

function pickNonEmptyLabel(
  primary: string | null | undefined,
  fallback: string | null | undefined,
): string {
  const primaryValue = primary?.trim()
  if (primaryValue) {
    return primaryValue
  }

  return fallback?.trim() ?? ''
}

export function resolveNavItemLabelForSurface(
  item: Pick<HeaderNavItemInput, 'label' | 'mobileLabel'>,
  surface: 'desktop' | 'mobile',
): string {
  if (surface === 'mobile') {
    return pickNonEmptyLabel(item.mobileLabel, item.label)
  }

  return item.label?.trim() ?? ''
}

export function resolveNavSubItemLabelForSurface(
  item: Pick<HeaderNavSubItemInput, 'label' | 'mobileLabel'>,
  surface: 'desktop' | 'mobile',
): string {
  if (surface === 'mobile') {
    return pickNonEmptyLabel(item.mobileLabel, item.label)
  }

  return item.label?.trim() ?? ''
}

export function hasNavItemVisibleLabel(item: Pick<HeaderNavItemInput, 'label' | 'mobileLabel'>): boolean {
  return Boolean(item.label?.trim() || item.mobileLabel?.trim())
}

export function hasNavSubItemVisibleLabel(
  item: Pick<HeaderNavSubItemInput, 'label' | 'mobileLabel'>,
): boolean {
  return Boolean(item.label?.trim() || item.mobileLabel?.trim())
}
