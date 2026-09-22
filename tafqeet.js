// arabic-tafqeet — spell a number or an amount in Arabic words (تفقيط), cheque and invoice style.
// MIT License, (c) 2026 Mahmoud Daghash.
// A fuller converter (riyal, dirham and dinar too, and words back to digits) runs free at
// https://confileo.com/ar/tafqeet-alarqam/

const ONES = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const TEENS = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر',
  'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const HUNDREDS = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة',
  'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

// Scale words, each with the four forms a counted noun takes (see nounFor).
const SCALES = [
  null,
  { one: 'ألف', two: 'ألفان', few: 'آلاف', many: 'ألفاً' },
  { one: 'مليون', two: 'مليونان', few: 'ملايين', many: 'مليوناً' },
  { one: 'مليار', two: 'ملياران', few: 'مليارات', many: 'ملياراً' },
];

// Masculine currencies only: 3–10 take the opposite gender of the noun, and this table
// assumes a masculine noun (جنيه، ريال، دولار) and a masculine sub-unit (قرش، سنت).
export const CURRENCIES = {
  EGP: { main: { one: 'جنيه', two: 'جنيهان', few: 'جنيهات', many: 'جنيهاً' },
         sub: { one: 'قرش', two: 'قرشان', few: 'قروش', many: 'قرشاً' } },
  USD: { main: { one: 'دولار', two: 'دولاران', few: 'دولارات', many: 'دولاراً' },
         sub: { one: 'سنت', two: 'سنتان', few: 'سنتات', many: 'سنتاً' } },
};

// 1..999, masculine, nominative. Units come before tens: 25 = خمسة وعشرون.
function below1000(n) {
  const parts = [];
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h) parts.push(HUNDREDS[h]);
  if (r >= 20) {
    const u = r % 10;
    const t = Math.floor(r / 10);
    parts.push(u ? `${ONES[u]} و${TENS[t]}` : TENS[t]);
  } else if (r >= 10) {
    parts.push(TEENS[r - 10]);
  } else if (r) {
    parts.push(ONES[r]);
  }
  return parts.join(' و');
}

// The form of a noun counted by n depends on n's last two digits:
// 3–10 plural (ثلاثة آلاف)، 11–99 singular accusative (أحد عشر ألفاً)، 00 singular (مائة ألف).
function nounFor(n, forms) {
  const r = n % 100;
  if (r >= 3 && r <= 10) return forms.few;
  if (r >= 11) return forms.many;
  return forms.one;
}

// A dual in front of a noun loses its final ن: مائتا ألف، ألفا جنيه، مليونا دولار.
function construct(words) {
  return words.replace(/(مائتان|ألفان|مليونان|ملياران)$/, (m) => m.slice(0, -1));
}

function counted(n, forms) {
  if (n === 1) return forms.one;
  if (n === 2) return forms.two;
  return `${construct(tafqeet(n))} ${nounFor(n, forms)}`;
}

/** Integer 0 … 999,999,999,999 in Arabic words (masculine, nominative). */
export function tafqeet(n) {
  if (!Number.isInteger(n) || n < 0 || n >= 1e12) throw new RangeError('tafqeet: integer 0 … 999,999,999,999');
  if (n === 0) return 'صفر';
  const parts = [];
  for (let s = 3; s >= 1; s--) {
    const k = Math.floor(n / 1000 ** s) % 1000;
    if (k) parts.push(counted(k, SCALES[s]));
  }
  const rest = n % 1000;
  if (rest) parts.push(below1000(rest));
  return parts.join(' و');
}

/**
 * An amount with its currency, framed the way banks expect:
 * tafqeetAmount(1250.5) → «فقط ألف ومائتان وخمسون جنيهاً وخمسون قرشاً لا غير»
 */
export function tafqeetAmount(amount, currency = 'EGP', { frame = true } = {}) {
  const c = CURRENCIES[currency];
  if (!c) throw new Error(`tafqeetAmount: unknown currency ${currency}`);
  const cents = Math.round(amount * 100);
  const whole = Math.floor(cents / 100);
  const frac = cents % 100;
  const parts = [];
  if (whole === 1) parts.push(`${c.main.one} واحد`);
  else if (whole) parts.push(counted(whole, c.main));
  if (frac === 1) parts.push(`${c.sub.one} واحد`);
  else if (frac) parts.push(counted(frac, c.sub));
  const text = parts.length ? parts.join(' و') : `صفر ${c.main.one}`;
  return frame ? `فقط ${text} لا غير` : text;
}
