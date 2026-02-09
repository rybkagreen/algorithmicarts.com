import { CurrencyData, CurrencyRate } from '@/types/demos';

// Function to fetch and parse currency data from our API
export async function fetchCurrencyData(baseCurrency: string = 'USD'): Promise<CurrencyData> {
  try {
    // For now, we'll use mock data since we need to properly implement the CBR API parsing
    // In a real implementation, we would fetch from our API route and parse the XML

    // Mock data based on real exchange rates
    const mockRates: Record<string, number> = {
      USD: baseCurrency === 'USD' ? 1 : 0.85,
      EUR: baseCurrency === 'USD' ? 0.92 : 1,
      GBP: baseCurrency === 'USD' ? 0.79 : 0.86,
      JPY: baseCurrency === 'USD' ? 149.5 : 162.5,
      CNY: baseCurrency === 'USD' ? 7.24 : 7.87,
      RUB: baseCurrency === 'USD' ? 92.5 : 107.5,
      CHF: baseCurrency === 'USD' ? 0.88 : 0.96,
      CAD: baseCurrency === 'USD' ? 1.36 : 1.48,
    };

    const rates: CurrencyRate[] = [];

    // Always ensure we have some rates, even if they're the same as base currency
    Object.entries(mockRates).forEach(([code, rate]) => {
      if (code !== baseCurrency) {
        rates.push({
          code,
          name: getCurrencyName(code), // In a real implementation, we'd get the proper name
          rate,
          change24h: parseFloat((Math.random() * 4 - 2).toFixed(2)), // Random change between -2% and +2%
        });
      }
    });

    // If no rates were added (meaning baseCurrency is not in our mock list), add some defaults
    if (rates.length === 0) {
      const defaultRates: Record<string, number> = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.5,
        CNY: 7.24,
        RUB: 92.5,
        CHF: 0.88,
        CAD: 1.36,
      };

      Object.entries(defaultRates).forEach(([code, rate]) => {
        if (code !== baseCurrency) {
          rates.push({
            code,
            name: getCurrencyName(code),
            rate,
            change24h: parseFloat((Math.random() * 4 - 2).toFixed(2)),
          });
        }
      });
    }

    return {
      base: baseCurrency,
      rates,
      lastUpdate: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching currency data:', error);
    // Return fallback data
    return {
      base: baseCurrency,
      rates: [],
      lastUpdate: Date.now(),
    };
  }
}

// Helper function to get currency names
function getCurrencyName(code: string): string {
  const names: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    CNY: 'Chinese Yuan',
    RUB: 'Russian Ruble',
    CHF: 'Swiss Franc',
    CAD: 'Canadian Dollar',
  };

  return names[code] || code;
}

// Function to parse XML response from CBR (simplified implementation)
export async function parseCBRXML(
  xmlText: string,
  baseCurrency: string = 'USD'
): Promise<CurrencyData> {
  try {
    // Create a DOM parser to parse the XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Failed to parse XML response from CBR');
    }

    // Extract rates from the XML
    const rates: CurrencyRate[] = [];
    const valuteElements = xmlDoc.querySelectorAll('Valute');

    valuteElements.forEach((valuteEl) => {
      const charCode = valuteEl.querySelector('CharCode')?.textContent || '';
      const name = valuteEl.querySelector('Name')?.textContent || '';
      const nominal = parseInt(valuteEl.querySelector('Nominal')?.textContent || '1');
      const valueStr = valuteEl.querySelector('Value')?.textContent || '0';
      const value = parseFloat(valueStr.replace(',', '.'));

      // Calculate rate per unit
      const rate = value / nominal;

      if (charCode && rate > 0) {
        rates.push({
          code: charCode,
          name,
          rate,
          change24h: parseFloat((Math.random() * 4 - 2).toFixed(2)),
        });
      }
    });

    return {
      base: baseCurrency,
      rates,
      lastUpdate: Date.now(),
    };
  } catch (error) {
    console.error('Error parsing CBR XML:', error);
    // Return fallback data
    return {
      base: baseCurrency,
      rates: [],
      lastUpdate: Date.now(),
    };
  }
}
