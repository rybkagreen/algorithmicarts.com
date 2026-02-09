import { CurrencyData, CurrencyRate } from '@/types/demos';

const CURRENCY_API_URL = 'https://api.exchangerate-api.com/v4/latest';

export async function fetchCurrencyRates(base: string = 'USD'): Promise<CurrencyData> {
  try {
    const response = await fetch(`${CURRENCY_API_URL}/${base}`);

    if (!response.ok) {
      throw new Error('Currency API error');
    }

    const data = await response.json();

    // Выбираем основные валюты
    const mainCurrencies = ['EUR', 'GBP', 'JPY', 'CNY', 'RUB', 'CHF', 'AUD', 'CAD'];
    const rates: CurrencyRate[] = mainCurrencies.map((code) => ({
      code,
      name: CURRENCY_NAMES[code] || code,
      rate: data.rates[code] || 1,
      change24h: Math.random() * 4 - 2, // Mock 24h change
    }));

    return {
      base,
      rates,
      lastUpdate: Date.now(),
    };
  } catch (error) {
    console.error('Currency fetch error:', error);
    return getMockCurrencyData(base);
  }
}

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CNY: 'Chinese Yuan',
  RUB: 'Russian Ruble',
  CHF: 'Swiss Franc',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
};

function getMockCurrencyData(base: string): CurrencyData {
  const mockRates: Record<string, number> = {
    EUR: base === 'USD' ? 0.92 : 1.09,
    GBP: base === 'USD' ? 0.79 : 1.27,
    JPY: base === 'USD' ? 149.5 : 0.0067,
    CNY: base === 'USD' ? 7.24 : 0.138,
    RUB: base === 'USD' ? 92.5 : 0.0108,
    CHF: base === 'USD' ? 0.88 : 1.14,
    AUD: base === 'USD' ? 1.52 : 0.66,
    CAD: base === 'USD' ? 1.36 : 0.74,
  };

  const rates: CurrencyRate[] = Object.entries(mockRates).map(([code, rate]) => ({
    code,
    name: CURRENCY_NAMES[code],
    rate,
    change24h: Math.random() * 4 - 2,
  }));

  return {
    base,
    rates,
    lastUpdate: Date.now(),
  };
}

export const AVAILABLE_BASES = ['USD', 'EUR', 'GBP', 'RUB'];