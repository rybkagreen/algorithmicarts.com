# AlgorithmicArts.com - AI Coder Agent QWEN Project Documentation

## Project Overview

AlgorithmicArts.com is a promotional website project for an IT developer, designed in the style of Warp.dev/Cursor.com. The project follows a sequential task-based approach to build a complete, dark-themed, high-contrast portfolio site with a "code aesthetic" using modern web technologies.

The project consists of 5 main tasks that progressively build the foundation, UI components, layout, content sections, and contact functionality:

1. **Project Setup** - Next.js 14 with TypeScript, Tailwind CSS, custom theming
2. **UI Components** - Reusable components with animations (Framer Motion)
3. **Layout Components** - Header, footer, navigation with mobile menu
4. **Content Sections** - Hero, services, portfolio preview, contact preview
5. **Contact Form** - Form with validation and Telegram integration

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Utilities**: clsx, tailwind-merge
- **Fonts**: Inter (sans-serif), JetBrains Mono (monospace)

## Project Structure

```
promo-site/
├── app/
│   ├── api/
│   │   └── contact/
│   ├── services/
│   ├── portfolio/
│   ├── about/
│   ├── contact/
│   └── demos/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   ├── demos/
│   └── forms/
├── lib/
├── hooks/
├── types/
└── public/
    └── images/
```

## Color Palette

The project uses a custom dark theme with high contrast:

- **Background Primary**: #0a0a0a
- **Background Secondary**: #1a1a1a
- **Background Tertiary**: #2a2a2a
- **Text Primary**: #ffffff
- **Text Secondary**: #a3a3a3
- **Text Muted**: #666666
- **Accent Primary**: #00d9ff (cyan)
- **Accent Secondary**: #a855f7 (purple)
- **Success**: #10b981 (green)
- **Error**: #ef4444 (red)
- **Border Primary**: #333333
- **Border Secondary**: #444444

## Key Features

### 1. Dark Theme with Code Aesthetic
- High contrast dark color scheme
- Monospace fonts for technical feel
- Terminal-style elements (">" prefixes, brackets)
- Animated typing effects

### 2. Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly elements (minimum 44px)

### 3. Animations & Interactions
- Smooth transitions with Framer Motion
- Hover and tap animations on interactive elements
- Scroll-triggered animations
- Loading states and indicators

### 4. Contact Integration
- Form validation with React Hook Form and Zod
- Telegram Bot API integration
- Rate limiting (3 requests per minute)
- Success/error feedback

## Building and Running

### Initial Setup
```bash
npx create-next-app@latest promo-site --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd promo-site
```

### Dependencies Installation
```bash
npm install framer-motion lucide-react
npm install react-hook-form @hookform/resolvers zod
npm install clsx tailwind-merge
npm install -D @types/node
```

### Configuration Files

#### Tailwind CSS (`tailwind.config.ts`)
Custom configuration with the project's color palette, typography, and animations.

#### Global Styles (`app/globals.css`)
Includes custom scrollbar, grid patterns, gradient text, and glow effects.

#### Font Configuration (`app/layout.tsx`)
Sets up Inter and JetBrains Mono fonts with CSS variables.

#### Environment Variables (`.env.local`)
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here
NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
```

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Development Conventions

### Code Quality
- TypeScript strict mode (no `any`)
- ESLint without warnings
- Prettier formatting
- Proper types for all props
- Naming conventions: camelCase for variables, PascalCase for components

### Performance
- Code splitting where possible
- Lazy loading for heavy components
- Optimized animations (transform/opacity)
- No layout shift

### Accessibility
- Semantic HTML
- ARIA labels for icons
- Keyboard navigation
- Focus states for all interactive elements
- Alt texts for images

### File Organization
- Use `@/*` alias for imports
- Component files in appropriate subdirectories
- TypeScript interfaces in `types/index.ts`
- Constants in `lib/constants.ts`
- Utility functions in `lib/utils.ts`

## Key Components

### UI Components
- **Button**: With primary, secondary, and ghost variants
- **Card**: With hover animations
- **Badge**: For technology tags
- **Input/Textarea**: With validation support
- **CodeBlock**: With copy functionality
- **Modal**: With backdrop
- **Loader**: Animated loading indicator

### Layout Components
- **Header**: Sticky with scroll effects and mobile menu
- **Footer**: With navigation and social links
- **ScrollProgress**: Visual scroll indicator
- **BackToTop**: Floating button for navigation

### Section Components
- **Hero**: With typing animation and tech stack
- **Services**: Problem-solution-technology format
- **PortfolioPreview**: Featured projects showcase
- **ContactPreview**: Quick contact options

## Testing Approach

After each task, verify:
1. `npm run dev` runs without errors
2. `npm run build` completes successfully
3. No TypeScript errors
4. No warnings in browser console
5. Visual check in browser
6. Mobile responsiveness (DevTools responsive mode)
7. Git commit with appropriate message

## Special Considerations

### Telegram Integration
The contact form integrates with Telegram Bot API. To set up:
1. Create a bot via @BotFather
2. Get your chat ID (via @userinfobot or similar)
3. Add credentials to `.env.local`

### Rate Limiting
Simple in-memory rate limiting (3 requests per minute) is implemented. For production, consider using Redis.

### Animation Preferences
Animations respect user's reduced motion preferences where possible.

### Performance Optimization
- Use transform and opacity for animations
- Implement proper lazy loading
- Optimize images and assets
- Minimize bundle size

## Git Workflow

After each completed task:
```bash
git add .
git commit -m "feat: <description from task>"
```

Example commit messages:
- `feat: initial project setup`
- `feat: add UI components library`
- `feat: add layout components`
- `feat: add hero and main page sections`
- `feat: add contact form with telegram integration`