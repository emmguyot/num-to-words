/**
 * This is library provides a method for converting arbitrary integers into english text.
 * For example, it would convert the number '123456' to 'one hundred twenty-three thousand four hundred fifty-six'
 *
 * All positive and negative integers are supported. Floating point numbers are rounded to integers
 * before being converted to words.
 *
 *
 * Examples:
 *   numberToWords(0);    // returns 'zero'
 *   numberToWords(10001);  // returns 'ten thousand one'
 *   numberToWords(111);  // returns 'one hundred eleven'
 *   numberToWords(-77);  // returns 'negative seventy-seven'
 *
 * @author Clinton Morrison <contact@clintonmorrison.com>
 */
import { shouldPrefixWithOne, shouldHyphenate } from './util';
import { numbers } from './numbers';

/**
 * Converts a number into the corresponding series of english words
 *
 * Examples:
 *  numberToWords(0);    // returns 'zero'
 *  numberToWords(10001);  // returns 'ten thousand one'
 *  numberToWords(111);  // returns 'one hundred eleven'
 *
 * @param {number} numToConvert
 * @returns {string}
 */
export function numberToWords (numToConvert) {
  let words = '';
  let prefixNum;
  let remainder;
  let closestSmallerNumber;
  let closestSmallerNumberText;

  numToConvert = parseInt(numToConvert, 10);

  if (isNaN(numToConvert)) {
    return 'not a number';
  }

  if (!isFinite(numToConvert)) {
    return 'infinity';
  }

  if (numToConvert < 0) {
    words += 'negative ';
    numToConvert *= -1;
  }

  // Search list of numbers for closest smaller number.
  // numToConvert will be written in terms of this number.
  for (const { number, text } of numbers) {
    if (numToConvert === number) {
      if (shouldPrefixWithOne(number)) {
        words += 'one ';
      }
      words += text;
      return words;
    }

    if (numToConvert > number) {
      closestSmallerNumber = number;
      closestSmallerNumberText = text;
      break;
    }
  }

  // How many 'closestSmallerNumber's can numToConvert be grouped into?
  // e.g. five 'thousand'.
  prefixNum = Math.floor(numToConvert / closestSmallerNumber);
  if (prefixNum !== 1 || shouldPrefixWithOne(closestSmallerNumber)) {
    words += numberToWords(prefixNum) + ' ';
  }

  words += closestSmallerNumberText;

  remainder = numToConvert - prefixNum * closestSmallerNumber;
  if (remainder > 0 && shouldHyphenate(closestSmallerNumber)) {
    words += '-';
  } else {
    words += ' ';
  }

  if (remainder > 0) {
    words += numberToWords(remainder);
  }

  return words.trim();
};

export default numberToWords;
