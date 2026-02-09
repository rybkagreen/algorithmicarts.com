// components/demos/analytics/ai/AiAssistant.tsx

import { useState, useRef, useEffect } from 'react';
import { callNlpService, type NlpResult } from './NlpProcessor';
// Removed unused imports

interface AiAssistantProps {
  onAction?: (result: NlpResult) => void;
  className?: string;
}

export function AiAssistant({ onAction, className }: AiAssistantProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ type: 'user' | 'assistant'; message: string }>
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  // Note: The actual implementation would use the dashboard context
  // For now, we'll simulate the actions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    // Add user message to conversation
    setConversation((prev) => [...prev, { type: 'user', message: input }]);
    setIsProcessing(true);

    try {
      // Process the input with NLP
      const result = await callNlpService(input);

      // Perform action based on NLP result
      switch (result.intent) {
        case 'show_currency_rates':
          if (result.entities?.currencies) {
            // Parse currencies from the input
            const currencies = result.entities.currencies
              .split(',')
              .map((c: string) => c.trim().toUpperCase())
              .filter((c: string) => c.length === 3);

            // Simulate adding currency widget with specified currencies
            console.log('Adding currency widget with currencies:', currencies);
          } else {
            // Simulate adding default currency widget
            console.log('Adding default currency widget');
          }
          break;

        case 'show_weather':
          if (result.entities?.location) {
            // Simulate adding weather widget with location
            console.log('Adding weather widget for location:', result.entities.location);
          } else {
            // Simulate adding default weather widget
            console.log('Adding default weather widget');
          }
          break;

        case 'show_github_stats':
          if (result.entities?.username) {
            // Simulate adding GitHub widget with username
            console.log('Adding GitHub widget for user:', result.entities.username);
          } else {
            // Simulate adding default GitHub widget
            console.log('Adding default GitHub widget');
          }
          break;

        case 'add_widget':
          if (result.entities?.widget) {
            const widgetType = result.entities.widget.toLowerCase();
            // Simulate adding widget
            console.log('Adding widget of type:', widgetType);
          }
          break;

        case 'change_dashboard_layout':
          // Simulate layout change
          console.log('Changing dashboard layout');
          break;

        default:
          // Unknown intent - add a response to the conversation
          setConversation((prev) => [
            ...prev,
            {
              type: 'assistant',
              message: `Я не совсем понял. Могли бы вы переформулировать запрос?`,
            },
          ]);
          break;
      }

      // Notify parent component of the action
      onAction?.(result);

      // Add assistant response to conversation
      if (result.intent !== 'default') {
        setConversation((prev) => [
          ...prev,
          {
            type: 'assistant',
            message: `Добавляю виджет: ${result.intent.replace('_', ' ')}`,
          },
        ]);
      }
    } catch (error) {
      console.error('Error processing NLP request:', error);
      setConversation((prev) => [
        ...prev,
        {
          type: 'assistant',
          message: `Произошла ошибка при обработке запроса. Попробуйте снова.`,
        },
      ]);
    } finally {
      setIsProcessing(false);
      setInput('');
    }
  };

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation]);

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-cyan-400 mb-2">AI Ассистент</h3>
        <p className="text-sm text-gray-400">
          Говорите или вводите команды, например: "Покажи курсы USD, EUR, GBP"
        </p>
      </div>

      <div className="mb-4 h-40 overflow-y-auto bg-gray-900 rounded p-3">
        {conversation.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Начните вводить команду...
          </div>
        ) : (
          <div className="space-y-2">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${msg.type === 'user' ? 'bg-cyan-900/30 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {msg.type === 'user' ? 'Вы:' : 'Ассистент:'}
                </div>
                <div>{msg.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите команду (например: 'Покажи погоду в Москве')"
          className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          disabled={isProcessing}
          ref={inputRef}
        />
        <button
          type="submit"
          disabled={isProcessing || !input.trim()}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? '...' : '→'}
        </button>
      </form>
    </div>
  );
}
