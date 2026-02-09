import { CurrencyData, CurrencyRate } from '@/types/demos';

export interface HistoricalCurrencyData {
  base: string;
  rates: Array<{
    date: string;
    rates: CurrencyRate[];
  }>;
}

export class CurrencyApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/currency') {
    this.baseUrl = baseUrl;
  }

  async getRates(baseCurrency: string): Promise<CurrencyData> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(
        `${this.baseUrl}?base=${baseCurrency}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout: Currency API did not respond in time');
        }
        throw error;
      }
      throw new Error('Unknown error occurred while fetching currency rates');
    }
  }

  async getHistoricalRates(
    baseCurrency: string,
    days: number = 7
  ): Promise<HistoricalCurrencyData> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(
        `${this.baseUrl}/history?base=${baseCurrency}&days=${days}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout: Currency history API did not respond in time');
        }
        throw error;
      }
      throw new Error('Unknown error occurred while fetching historical rates');
    }
  }

  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    const data = await this.getRates(fromCurrency);

    const toRate = data.rates.find(r => r.code === toCurrency);

    if (!toRate) {
      throw new Error(`Currency ${toCurrency} not found in rates`);
    }

    return amount * toRate.rate;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any;

    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    const message = errorData.message || `HTTP ${response.status}`;
    throw new Error(message);
  }
}

// Singleton instance
export const currencyApiClient = new CurrencyApiClient();
