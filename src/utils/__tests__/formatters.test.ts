import {
  formatNumber,
  formatPrice,
  formatPercentage,
  getPriceChangeColor,
  getPriceChangeBadgeVariant,
  formatDate,
  stripHtml,
  safeGet,
  isValidNumber,
  toNumber
} from '../formatters';

describe('formatNumber', () => {
  test('handles null and undefined values', () => {
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
    expect(formatNumber('')).toBe('0');
  });

  test('formats numbers with appropriate suffixes', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(2500000000)).toBe('2.5B');
    expect(formatNumber(3500000000000)).toBe('3.5T');
  });

  test('handles string numbers', () => {
    expect(formatNumber('1000')).toBe('1.0K');
    expect(formatNumber('1500000')).toBe('1.5M');
  });

  test('handles invalid values', () => {
    expect(formatNumber('invalid')).toBe('0');
    expect(formatNumber(NaN)).toBe('0');
    expect(formatNumber(Infinity)).toBe('0');
  });

  test('handles negative numbers', () => {
    expect(formatNumber(-1000)).toBe('-1.0K');
    expect(formatNumber(-1500000)).toBe('-1.5M');
  });
});

describe('formatPrice', () => {
  test('formats prices correctly', () => {
    expect(formatPrice(1000)).toBe('1,000');
    expect(formatPrice(1234567)).toBe('1,234,567');
  });

  test('handles null and undefined', () => {
    expect(formatPrice(null)).toBe('0');
    expect(formatPrice(undefined)).toBe('0');
    expect(formatPrice(NaN)).toBe('0');
  });
});

describe('formatPercentage', () => {
  test('formats percentages correctly', () => {
    expect(formatPercentage(5.123)).toBe('5.12%');
    expect(formatPercentage(-2.456)).toBe('-2.46%');
  });

  test('handles null and undefined', () => {
    expect(formatPercentage(null)).toBe('0.00%');
    expect(formatPercentage(undefined)).toBe('0.00%');
    expect(formatPercentage(NaN)).toBe('0.00%');
  });

  test('respects decimal places', () => {
    expect(formatPercentage(5.123, 1)).toBe('5.1%');
    expect(formatPercentage(5.123, 3)).toBe('5.123%');
  });
});

describe('getPriceChangeColor', () => {
  test('returns correct colors for price changes', () => {
    expect(getPriceChangeColor(5)).toBe('text-green-600 dark:text-green-400');
    expect(getPriceChangeColor(-5)).toBe('text-red-600 dark:text-red-400');
    expect(getPriceChangeColor(0)).toBe('text-yellow-600 dark:text-yellow-400');
  });

  test('handles null and undefined', () => {
    expect(getPriceChangeColor(null)).toBe('text-muted-foreground');
    expect(getPriceChangeColor(undefined)).toBe('text-muted-foreground');
    expect(getPriceChangeColor(NaN)).toBe('text-muted-foreground');
  });
});

describe('getPriceChangeBadgeVariant', () => {
  test('returns correct variants for price changes', () => {
    expect(getPriceChangeBadgeVariant(5)).toBe('default');
    expect(getPriceChangeBadgeVariant(-5)).toBe('destructive');
    expect(getPriceChangeBadgeVariant(0)).toBe('secondary');
  });

  test('handles null and undefined', () => {
    expect(getPriceChangeBadgeVariant(null)).toBe('secondary');
    expect(getPriceChangeBadgeVariant(undefined)).toBe('secondary');
    expect(getPriceChangeBadgeVariant(NaN)).toBe('secondary');
  });
});

describe('formatDate', () => {
  test('formats dates correctly', () => {
    const date = '2023-12-25T10:30:00.000Z';
    const formatted = formatDate(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test('handles invalid dates', () => {
    expect(formatDate(null)).toBe('N/A');
    expect(formatDate(undefined)).toBe('N/A');
    expect(formatDate('')).toBe('N/A');
    expect(formatDate('invalid-date')).toBe('N/A');
  });
});

describe('stripHtml', () => {
  test('removes HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
    expect(stripHtml('<div><ul><li>Item 1</li><li>Item 2</li></ul></div>')).toBe('Item 1Item 2');
  });

  test('handles null and undefined', () => {
    expect(stripHtml(null)).toBe('Không có thông tin');
    expect(stripHtml(undefined)).toBe('Không có thông tin');
    expect(stripHtml('')).toBe('Không có thông tin');
  });
});

describe('safeGet', () => {
  const testObj = {
    level1: {
      level2: {
        value: 'found'
      }
    }
  };

  test('gets nested values safely', () => {
    expect(safeGet(testObj, 'level1.level2.value', 'default')).toBe('found');
    expect(safeGet(testObj, 'level1.level2.missing', 'default')).toBe('default');
    expect(safeGet(testObj, 'missing.path', 'default')).toBe('default');
  });

  test('handles null objects', () => {
    expect(safeGet(null, 'any.path', 'default')).toBe('default');
    expect(safeGet(undefined, 'any.path', 'default')).toBe('default');
  });
});

describe('isValidNumber', () => {
  test('validates numbers correctly', () => {
    expect(isValidNumber(5)).toBe(true);
    expect(isValidNumber(0)).toBe(true);
    expect(isValidNumber(-5)).toBe(true);
    expect(isValidNumber(5.5)).toBe(true);
  });

  test('rejects invalid numbers', () => {
    expect(isValidNumber(NaN)).toBe(false);
    expect(isValidNumber(Infinity)).toBe(false);
    expect(isValidNumber(-Infinity)).toBe(false);
    expect(isValidNumber('5')).toBe(false);
    expect(isValidNumber(null)).toBe(false);
    expect(isValidNumber(undefined)).toBe(false);
  });
});

describe('toNumber', () => {
  test('converts values to numbers', () => {
    expect(toNumber(5)).toBe(5);
    expect(toNumber('5')).toBe(5);
    expect(toNumber('5.5')).toBe(5.5);
    expect(toNumber('1,000')).toBe(1000);
  });

  test('uses fallback for invalid values', () => {
    expect(toNumber('invalid')).toBe(0);
    expect(toNumber(null)).toBe(0);
    expect(toNumber(undefined)).toBe(0);
    expect(toNumber('invalid', 100)).toBe(100);
  });
});
