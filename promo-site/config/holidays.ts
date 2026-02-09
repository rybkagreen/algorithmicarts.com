// /config/holidays.ts

export const RUSSIAN_HOLIDAYS = [
  '01.01', '02.01', '03.01', '04.01', '05.01', '06.01', '07.01', '08.01', // New Year
  '23.02', // Defender of the Fatherland Day
  '08.03', // International Women's Day
  '01.05', '09.05', // Labour Day and Victory Day
  '12.06', // Russia Day
  '04.11', // Unity Day
];

// Function to check if a specific year has different holidays
export function getHolidaysForYear(year: number): string[] {
  // This can be extended to handle year-specific changes
  return RUSSIAN_HOLIDAYS;
}
