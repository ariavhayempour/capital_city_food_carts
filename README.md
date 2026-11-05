# Capital City Food Carts 🚚

A centralized web application for discovering and exploring food carts throughout Madison, Wisconsin, with a focus on the State Street and Library Mall area.

## 🌟 Features

- **Browse Food Trucks**: View all available food carts in the Madison area
- **Search & Filter**: Search by name or description, filter by cuisine category and location
- **Detailed Information**: Access complete menus, pricing, schedules, and contact information
- **Real-Time Status**: See which carts are currently open
- **Mobile Responsive**: Seamless experience across all devices
- **Performance Tracking**: Integrated Vercel Analytics and SpeedInsights

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Lightning-fast build tool
- **Wouter** - Lightweight client-side routing
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Beautifully designed components
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library

### Backend (Development Only)
- **Express.js** - Node.js web framework for local development
- **TypeScript** - Type-safe development
- **Static JSON Export** - Production uses pre-generated `carts.json` file

### Deployment
- **Vercel** - Serverless deployment platform
- **Vercel Analytics** - User analytics
- **Vercel SpeedInsights** - Performance monitoring

## 📁 Project Structure

```
capital_city_food_carts/
├── attached_assets/      # Source images (for processing/archival)
├── client/              # Frontend React application
│   ├── public/          # Static assets (images, carts.json)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   │   └── ui/      # shadcn/ui components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   ├── pages/       # Page components
│   │   ├── App.tsx      # Main app component
│   │   └── main.tsx     # Application entry point
│   └── index.html
├── server/              # Development server (not deployed)
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions (dev only)
│   ├── storage.ts       # Food cart data source
│   └── vite.ts          # Vite dev server configuration
├── scripts/             # Build and utility scripts
│   ├── export-carts.ts  # Exports storage.ts to carts.json
│   ├── optimize-images.sh # Resizes cart photos + writes WebP variants (run after adding a photo)
│   └── crop-image.py    # Image preprocessing script
├── shared/              # Shared TypeScript types/schemas
│   └── schema.ts        # Food cart data schema
├── dist/                # Production build output
│   └── public/          # Static files deployed to Vercel
│       ├── assets/      # Vite-bundled JS/CSS
│       ├── carts.json   # Generated cart data
│       └── *.jpg        # Cart images
└── vercel.json          # Vercel deployment configuration
```

## 🎨 Design System

### Color Scheme
- **Primary**: Red-maroon (`hsl(0 80% 45%)`)
- **Accent**: Yellow buttons and highlights
- **Text**: Dark gray on white backgrounds
- **Theme**: Red-maroon and white throughout

### Components
The application uses shadcn/ui components with custom Tailwind styling:
- Cards for cart listings
- Dialogs for detailed views
- Buttons with consistent styling
- Responsive navigation
- Accessible form controls

### Deployment Architecture

**Static Export Strategy:**
- Production uses a fully static site (no serverless functions)
- `npm run build` generates `carts.json` from `server/storage.ts`
- Vercel serves pre-built static files from `dist/public/`
- Client fetches `/carts.json` directly (no API calls)

**Benefits:**
- Lightning-fast page loads (no API latency)
- Lower hosting costs (no serverless compute)
- Better caching and CDN distribution
- Improved reliability

**Trade-off:**
- Updates require rebuild and redeployment
- No real-time data updates
- Manual process for content changes

## 📧 Contact

- Project Maintainer: Ariav Hayempour
- GitHub: [@ariavhayempour](https://github.com/ariavhayempour)

## Copyright (c) [2025] [Ariav Hayempour]. All rights reserved. Duplication prohibited.
