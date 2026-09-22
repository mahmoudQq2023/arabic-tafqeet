# arabic-tafqeet

Spell a number or an amount in Arabic words — **تفقيط** — the way cheques and invoices need it.

```js
import { tafqeet, tafqeetAmount } from './tafqeet.js';

tafqeet(1250750);        // مليون ومائتان وخمسون ألفاً وسبعمائة وخمسون
tafqeetAmount(1250.5);   // فقط ألف ومائتان وخمسون جنيهاً وخمسون قرشاً لا غير
tafqeetAmount(15, 'USD', { frame: false });  // خمسة عشر دولاراً
```

No dependencies, one file, integers up to 999,999,999,999. Run the tests with `node test.mjs`.

## The four rules it gets right

Most number-to-words code translates digits one at a time, which fails in Arabic immediately:

1. **Units before tens.** 25 is «خمسة وعشرون» (five and twenty), not «عشرون وخمسة».
2. **3–10 take the opposite gender of the noun.** «ثلاثة جنيهات» but «ثلاث ليرات». This library counts masculine nouns (جنيه، دولار، قرش، ألف، مليون).
3. **The counted noun follows the last two digits.** 3–10 → plural (ثلاثة **آلاف**), 11–99 → singular accusative (أحد عشر **ألفاً**), a round hundred → singular (مائة **ألف**).
4. **A dual in front of a noun drops its ن.** «مائتا ألف»، «ألفا جنيه»، not «مائتان ألف».

The reasoning behind each rule, with the traps that produced them, is written up in [Spelling numbers in Arabic is harder than it looks](https://dev.to/support_confileo_ce7442eb).

## Not covered here

Feminine counted nouns (ليرة، هللة) and ordinal numbers are out of scope. If you need more currencies (riyal, dirham, dinar) or to read Arabic words back into digits, the free online converter does both: **[تفقيط الأرقام — Arabic number to words](https://confileo.com/ar/tafqeet-alarqam/)**, part of [Confileo](https://confileo.com/).

## License

MIT © Mahmoud Daghash
