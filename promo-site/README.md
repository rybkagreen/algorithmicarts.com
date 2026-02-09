# Promo Site - IT Developer Portfolio

This is a promotional website for an IT developer, built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. The design follows a dark theme with a "code aesthetic" inspired by Warp.dev/Cursor.com.

## Features

- Dark theme with high contrast
- Modern tech stack (Next.js 14, TypeScript, Tailwind CSS)
- Responsive design
- Custom animations with Framer Motion
- Terminal-style UI elements

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API Keys (for demos)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here
NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter