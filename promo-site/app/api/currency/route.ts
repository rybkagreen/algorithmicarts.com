import { NextRequest, NextResponse } from 'next/server';
import { RUSSIAN_HOLIDAYS } from '@/config/holidays';

interface CbrRate {
  code: string;
  nominal: number;
  value: number;
  name: string;
}

// In-memory cache for rate limiting
const requestCache = new Map<string, number[]>();

function checkRateLimit(ip: string, limit: number = 10): boolean {
  const now = Date.now();
  const timestamps = requestCache.get(ip) || [];

  // Remove timestamps older than 1 minute
  const recentTimestamps = timestamps.filter((t) => now - t < 60000);

  if (recentTimestamps.length >= limit) {
    return false;
  }

  recentTimestamps.push(now);
  requestCache.set(ip, recentTimestamps);

  return true;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 6 || day === 0;
}

function isHoliday(date: Date): boolean {
  const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  return RUSSIAN_HOLIDAYS.includes(dateStr);
}

function getLastWorkingDay(date: Date): Date {
  const workingDate = new Date(date);

  while (isWeekend(workingDate) || isHoliday(workingDate)) {
    workingDate.setDate(workingDate.getDate() - 1);
  }

  return workingDate;
}

function formatDateForCBR(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function fetchCBRData(date: string): Promise<CbrRate[]> {
  const response = await fetch(`https://www.cbr.ru/scripts/XML_daily.asp?date_req=${date}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CurrencyBot/1.0)',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`CBR API error: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder('windows-1251');
  const xmlData = decoder.decode(buffer);

  // Parse XML to extract rates
  return parseCBRXML(xmlData);
}

function parseCBRXML(xml: string): CbrRate[] {
  const rates: CbrRate[] = [];
  const valuteRegex = /<Valute[^>]*>([\s\S]*?)<\/Valute>/g;

  let match;
  while ((match = valuteRegex.exec(xml)) !== null) {
    const valuteContent = match[1];

    const codeMatch = /<CharCode>([^<]+)<\/CharCode>/.exec(valuteContent);
    const nameMatch = /<Name>([^<]+)<\/Name>/.exec(valuteContent);
    const nominalMatch = /<Nominal>([^<]+)<\/Nominal>/.exec(valuteContent);
    const valueMatch = /<Value>([^<]+)<\/Value>/.exec(valuteContent);

    if (codeMatch && nameMatch && nominalMatch && valueMatch) {
      rates.push({
        code: codeMatch[1],
        name: nameMatch[1],
        nominal: parseInt(nominalMatch[1]),
        value: parseFloat(valueMatch[1].replace(',', '.')),
      });
    }
  }

  return rates;
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
      { status: 429 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const baseCurrency = searchParams.get('base') || 'RUB';

  try {
    const today = new Date();
    const workingToday = getLastWorkingDay(today);

    const yesterday = new Date(workingToday);
    yesterday.setDate(yesterday.getDate() - 1);
    const workingYesterday = getLastWorkingDay(yesterday);

    const [todayRates, yesterdayRates] = await Promise.all([
      fetchCBRData(formatDateForCBR(workingToday)),
      fetchCBRData(formatDateForCBR(workingYesterday)),
    ]);

    // Calculate changes and format response
    const rates = todayRates.map((todayRate) => {
      const yesterdayRate = yesterdayRates.find((r) => r.code === todayRate.code);

      const todayValue = todayRate.value / todayRate.nominal;
      const yesterdayValue = yesterdayRate
        ? yesterdayRate.value / yesterdayRate.nominal
        : todayValue;

      return {
        code: todayRate.code,
        name: todayRate.name,
        rate: todayValue,
        change24h: calculateChange(todayValue, yesterdayValue),
      };
    });

    return NextResponse.json(
      {
        base: baseCurrency,
        rates,
        lastUpdate: workingToday.getTime(),
        workingDate: formatDateForCBR(workingToday),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Currency API error:', error);

    return NextResponse.json(
      {
        error: 'CBR_API_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch currency data',
      },
      { status: 502 }
    );
  }
}
