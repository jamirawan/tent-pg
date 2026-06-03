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

## Vehicle type efficiency ranges

| ID       | Name                         | Eff Min | Eff Max | Example Vehicles                         |
|----------|------------------------------|--------:|--------:|------------------------------------------|
| small    | Small / light car            | 3.3     | 7.5     | Yaris, Mazda2, Polo                      |
| medium   | Medium car                   | 4.0     | 9.0     | Camry, Mazda3, Civic                     |
| large    | Large car / people mover     | 6.5     | 11.5    | Kia Stinger, Carnival, Odyssey           |
| suv_sm   | SUV (small / medium)         | 7.0     | 9.5     | CX-5, RAV4, Tucson                       |
| suv_lg   | SUV / ute / truck (large)    | 7.0     | 13.5    | LandCruiser, HiLux, Ranger, Patrol       |
| caravan  | 4WD + caravan                | 16.0    | 25.0    | Ute towing a van or camper trailer       |

## Distance or route table

| From \ To | SYD | MEL | BNE | PER | ADL | CBR | HBA | DRW | ASP | NHU | KTR | ULU | TNK | KAK |
|-----------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| SYD | — | 878 | 923 | 4016 | 1376 | 281 | 1160 | 3934 | 2762 | 4553 | 3544 | 2841 | 3027 | 4179 |
| MEL | 878 | — | 1765 | 3509 | 727 | 654 | 597 | 3752 | 2255 | 4371 | 3362 | 2303 | 2520 | 3997 |
| BNE | 923 | 1765 | — | 4311 | 2045 | 1185 | 2103 | 3426 | 2730 | 4225 | 3217 | 3001 | 2994 | 3671 |
| PER | 4016 | 3509 | 4311 | — | 2716 | 3787 | 4106 | 4032 | 2481 | 4950 | 3841 | 3041 | 2746 | 4277 |
| ADL | 1376 | 727 | 2045 | 2716 | — | 1188 | 1328 | 3025 | 1528 | 3644 | 2635 | 1602 | 1793 | 3270 |
| CBR | 281 | 654 | 1185 | 3787 | 1188 | — | 1130 | 3955 | 2783 | 4574 | 3565 | 2635 | 3048 | 4200 |
| HBA | 1160 | 597 | 2103 | 4106 | 1328 | 1130 | — | 4349 | 2852 | 4968 | 3959 | 2900 | 3117 | 4494 |
| DRW | 3934 | 3752 | 3426 | 4032 | 3025 | 3955 | 4349 | — | 1497 | 1150 | 317 | 1964 | 676 | 245 |
| ASP | 2762 | 2255 | 2730 | 2481 | 1528 | 2783 | 2852 | 1497 | — | 2647 | 1180 | 450 | 507 | 1742 |
| NHU | 4553 | 4371 | 4225 | 4950 | 3644 | 4574 | 4968 | 1150 | 2647 | — | 1467 | 2797 | 1826 | 1395 |
| KTR | 3544 | 3362 | 3217 | 3841 | 2635 | 3565 | 3959 | 317 | 1180 | 1467 | — | 1634 | 959 | 562 |
| ULU | 2841 | 2303 | 3001 | 3041 | 1602 | 2635 | 2900 | 1964 | 450 | 2797 | 1634 | 0 | 957 | 2209 |
| TNK | 3027 | 2520 | 2994 | 2746 | 1793 | 3048 | 3117 | 676 | 507 | 1826 | 959 | 957 | — | 921 |
| KAK | 3776 | 3589 | 3258 | 3822 | 3864 | 3771 | 4303 | 245 | 1488 | 1034 | 309 | 1935 | 921 | — |


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


