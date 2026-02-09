import { type ContactFormData } from './validations';

export async function sendToTelegram(data: ContactFormData): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Telegram credentials not configured');
    return false;
  }

  const projectTypes: Record<string, string> = {
    bot: 'Telegram-бот',
    website: 'Веб-сайт',
    pwa: 'PWA приложение',
    automation: 'Автоматизация',
    other: 'Другое',
  };

  const message = `
🔔 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
${data.phone ? `📱 <b>Телефон:</b> ${data.phone}` : ''}
${data.projectType ? `📋 <b>Тип проекта:</b> ${projectTypes[data.projectType]}` : ''}
${data.budget ? `💰 <b>Бюджет:</b> ${data.budget}` : ''}

💬 <b>Сообщение:</b>
${data.message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
  `.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Telegram API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}