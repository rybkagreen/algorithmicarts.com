import { RefreshCw, AlertCircle, CloudRain, WifiOff } from 'lucide-react';

interface WeatherWidgetErrorProps {
  error: Error;
  onRetry: () => void;
}

export function WeatherWidgetError({ error, onRetry }: WeatherWidgetErrorProps) {
  let errorTitle = 'Something went wrong';
  let errorDescription = 'An unexpected error occurred. Please try again.';
  let errorIcon = AlertCircle;

  if (error.message.includes('WEATHER_API_ERROR')) {
    errorTitle = 'Unable to fetch weather data';
    errorDescription = 'The weather API is currently unavailable. Please try again later.';
    errorIcon = CloudRain;
  } else if (error.message.includes('NETWORK_ERROR') || error.message.includes('fetch')) {
    errorTitle = 'Network connection issue';
    errorDescription = 'Please check your internet connection and try again.';
    errorIcon = WifiOff;
  }

  const ErrorIcon = errorIcon;

  return (
    <div
      className="p-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <ErrorIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">{errorTitle}</h3>
      <p className="text-gray-400 mb-4">{errorDescription}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm font-medium transition-colors"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </button>
    </div>
  );
}
