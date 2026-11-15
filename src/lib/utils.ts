import type { Lang } from '../i18n'

const faDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
const arDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩']

export function localizeDigits(s: string | number, lang: Lang): string {
  const str = String(s)
  if (lang === 'fa') return str.replace(/\d/g, d => faDigits[+d])
  if (lang === 'ar') return str.replace(/\d/g, d => arDigits[+d])
  return str
}

export function formatPrice(n: number, lang: Lang): string {
  return localizeDigits(n.toLocaleString('en-US'), lang)
}

export function discounted(price: number, discount?: number): number {
  if (!discount) return price
  return Math.round((price * (100 - discount)) / 100)
}
