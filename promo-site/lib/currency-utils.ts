// Available currencies for the application
export const AVAILABLE_CURRENCIES = [
  { charCode: 'R01235', name: 'USD', symbol: '$', fullName: 'US Dollar' },
  { charCode: 'R01239', name: 'EUR', symbol: '€', fullName: 'Euro' },
  { charCode: 'R01010', name: 'AUD', symbol: 'A$', fullName: 'Australian Dollar' },
  { charCode: 'R01035', name: 'GBP', symbol: '£', fullName: 'British Pound' },
  { charCode: 'R01375', name: 'CNY', symbol: '¥', fullName: 'Chinese Yuan' },
  { charCode: 'R01020A', name: 'CAD', symbol: 'C$', fullName: 'Canadian Dollar' },
  { charCode: 'R01035A', name: 'GBP', symbol: '£', fullName: 'British Pound' },
  { charCode: 'R01235A', name: 'USD', symbol: '$', fullName: 'US Dollar' },
  { charCode: 'R01535', name: 'JPY', symbol: '¥', fullName: 'Japanese Yen' },
  { charCode: 'R01135', name: 'CHF', symbol: 'Fr', fullName: 'Swiss Franc' },
  { charCode: 'R01350', name: 'KZT', symbol: '₸', fullName: 'Kazakhstani Tenge' },
  { charCode: 'R01235', name: 'TRY', symbol: '₺', fullName: 'Turkish Lira' },
  { charCode: 'R01235', name: 'CZK', symbol: 'Kč', fullName: 'Czech Koruna' },
  { charCode: 'R01235', name: 'NOK', symbol: 'kr', fullName: 'Norwegian Krone' },
  { charCode: 'R01235', name: 'SEK', symbol: 'kr', fullName: 'Swedish Krona' },
  { charCode: 'R01235', name: 'PLN', symbol: 'zł', fullName: 'Polish Zloty' },
  { charCode: 'R01100', name: 'UAH', symbol: '₴', fullName: 'Ukrainian Hryvnia' },
];

/**
 * Normalizes a currency rate to a standard format
 * @param rate - The raw rate from the API
 * @returns normalized rate
 */
export function normalizeRate(rate: number): number {
  // Ensure the rate is positive and has reasonable bounds
  return Math.abs(rate) > 0 ? Math.abs(rate) : 1;
}

/**
 * Converts an amount from one currency to another
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param rates - Current exchange rates
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: { code: string; rate: number }[]
): number {
  // If converting to the same currency, return the amount
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Find the source and target currency rates
  const toRate = rates.find(rate => rate.code === toCurrency);
  const rate = toRate?.rate ?? 1;

  // Find the source currency rate
  const fromRate = rates.find(rate => rate.code === fromCurrency);
  const fromRateValue = fromRate?.rate ?? 1;

  // Convert the amount
  const fromValue = amount / fromRateValue;
  const toValue = fromValue * rate;

  return toValue;
}

/**
 * Calculates the percentage change between two values
 * @param currentValue - Current value
 * @param previousValue - Previous value
 * @returns Percentage change
 */
export function calculateChange(currentValue: number, previousValue: number): number {
  if (previousValue === 0) {
    return 0;
  }
  return ((currentValue - previousValue) / previousValue) * 100;
}

/**
 * Formats a rate value for display
 * @param rate - Rate to format
 * @param decimals - Number of decimal places (default: 4)
 * @returns Formatted rate string
 */
export function formatRate(rate: number, decimals: number = 4): string {
  return rate.toFixed(decimals);
}
