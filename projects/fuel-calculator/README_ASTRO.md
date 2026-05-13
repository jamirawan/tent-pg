# Fuel Calculator - Astro.js

A modern Astro.js website for calculating fuel costs for road trips across the Northern Territory, Australia.

## Project Structure

```
src/
├── components/          # Astro components
│   ├── Header.astro
│   ├── Hero.astro
│   ├── Footer.astro
│   ├── InfoCards.astro
│   └── CalculatorSection.astro
├── layouts/             # Layout components
│   └── Layout.astro
├── pages/               # Route pages
│   └── index.astro
├── scripts/             # TypeScript utilities
│   └── calculator.ts
└── styles/              # Global styles
    └── global.css
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- **Vehicle Type Selection**: Choose from 8 vehicle types (City Car, Sedan, SUV, Truck, Sports, Van, Hybrid, Electric)
- **Route Calculator**: Select from popular NT routes or enter custom distances
- **Fuel Cost Estimation**: Calculate total costs, per-person costs, fuel consumption, and CO₂ emissions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Components**: Real-time calculations and route information

## Technologies Used

- **Astro**: Static site generation framework
- **TypeScript**: Type-safe scripting
- **CSS3**: Modern styling with CSS variables
- **HTML5**: Semantic markup

## Development

The project uses Astro's component-based architecture:

- **`.astro` files**: Server-side rendered components
- **Inline `<script>` tags**: Client-side interactivity
- **`global.css`**: Shared styles for all pages

## Building

To create a production build:

```bash
npm run build
```

This generates optimized static files in the `dist/` directory.

## License

© Tourism and Events NT
