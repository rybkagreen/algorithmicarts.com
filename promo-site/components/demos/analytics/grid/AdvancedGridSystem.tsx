import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

interface GridContextProps {
  cols: number;
  gap: string;
}

const GridContext = createContext<GridContextProps>({
  cols: 12,
  gap: '4',
});

interface GridProviderProps {
  children: ReactNode;
  cols?: number;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number; // More granular gap options
}

export function GridProvider({ children, cols = 12, gap = 'md' }: GridProviderProps) {
  // Convert gap size to actual spacing
  const gapValue =
    typeof gap === 'string' ? { xs: '1', sm: '2', md: '4', lg: '6', xl: '8' }[gap] : gap.toString();

  return (
    <GridContext.Provider value={{ cols, gap: gapValue }}>
      <div className={cn(`grid grid-cols-${cols}`, `gap-${gapValue}`)}>{children}</div>
    </GridContext.Provider>
  );
}

interface GridItemProps {
  children: ReactNode;
  span?: number; // Number of columns to span
  start?: number; // Column start position
  end?: number; // Column end position
  sm?: { span?: number; start?: number; end?: number };
  md?: { span?: number; start?: number; end?: number };
  lg?: { span?: number; start?: number; end?: number };
  xl?: { span?: number; start?: number; end?: number };
  className?: string;
}

export function GridItem({
  children,
  span = 1,
  start,
  end,
  sm,
  md,
  lg,
  xl,
  className,
}: GridItemProps) {
  const { cols } = useContext(GridContext);

  // Calculate base classes
  const baseClasses = [
    start ? `col-start-${start}` : '',
    end ? `col-end-${end}` : '',
    `col-span-${span}`,
  ]
    .filter(Boolean)
    .join(' ');

  // Calculate responsive classes
  const responsiveClasses = [
    sm
      ? [
          sm.start ? `sm:col-start-${sm.start}` : '',
          sm.end ? `sm:col-end-${sm.end}` : '',
          sm.span ? `sm:col-span-${sm.span}` : '',
        ]
          .filter(Boolean)
          .join(' ')
      : '',
    md
      ? [
          md.start ? `md:col-start-${md.start}` : '',
          md.end ? `md:col-end-${md.end}` : '',
          md.span ? `md:col-span-${md.span}` : '',
        ]
          .filter(Boolean)
          .join(' ')
      : '',
    lg
      ? [
          lg.start ? `lg:col-start-${lg.start}` : '',
          lg.end ? `lg:col-end-${lg.end}` : '',
          lg.span ? `lg:col-span-${lg.span}` : '',
        ]
          .filter(Boolean)
          .join(' ')
      : '',
    xl
      ? [
          xl.start ? `xl:col-start-${xl.start}` : '',
          xl.end ? `xl:col-end-${xl.end}` : '',
          xl.span ? `xl:col-span-${xl.span}` : '',
        ]
          .filter(Boolean)
          .join(' ')
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={cn(baseClasses, responsiveClasses, className)}>{children}</div>;
}

// Fractional grid system for more granular control
interface FractionalGridProps {
  children: ReactNode;
  fractions: number[]; // Array of fractional units (e.g., [1, 2, 1] for 1fr 2fr 1fr)
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

export function FractionalGrid({
  children,
  fractions,
  gap = 'md',
  className,
}: FractionalGridProps) {
  // Convert gap size to actual spacing
  const gapValue =
    typeof gap === 'string' ? { xs: '1', sm: '2', md: '4', lg: '6', xl: '8' }[gap] : gap.toString();

  // Create grid template columns based on fractions
  const templateColumns = fractions.map((f) => `${f}fr`).join(' ');

  return (
    <div
      className={cn(`grid gap-${gapValue}`, className)}
      style={{ gridTemplateColumns: templateColumns }}
    >
      {children}
    </div>
  );
}

// Container-aware grid that adjusts based on available space
interface ContainerAwareGridProps {
  children: ReactNode;
  minWidth?: string; // Minimum width for each grid item (e.g., '200px', '15rem')
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

export function ContainerAwareGrid({
  children,
  minWidth = '250px',
  gap = 'md',
  className,
}: ContainerAwareGridProps) {
  // Convert gap size to actual spacing
  const gapValue =
    typeof gap === 'string' ? { xs: '1', sm: '2', md: '4', lg: '6', xl: '8' }[gap] : gap.toString();

  return (
    <div
      className={cn(`grid gap-${gapValue}`, className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}
