export const cars = [
  { id: 'city', name: 'City Car', icon: '🚗', eff: 6.5, eg: 'Yaris, Polo' },
  { id: 'sedan', name: 'Sedan', icon: '🚙', eff: 8.0, eg: 'Camry, Mazda3' },
  { id: 'suv', name: 'SUV', icon: '🚐', eff: 10.5, eg: 'RAV4, CX-5' },
  { id: 'truck', name: 'Ute / Truck', icon: '🛻', eff: 12.5, eg: 'HiLux, Ranger' },
  { id: 'sports', name: 'Sports', icon: '🏎️', eff: 11.0, eg: 'BRZ, MX-5' },
  { id: 'van', name: 'Van / Bus', icon: '🚌', eff: 14.0, eg: 'Hiace, Transit' },
  { id: 'hybrid', name: 'Hybrid', icon: '🌿', eff: 4.5, eg: 'Prius, Corolla' },
  {
    id: 'electric',
    name: 'Electric',
    icon: '⚡',
    eff: 0,
    eg: 'Tesla, BYD',
    isEv: true,
  },
];

export const DIST = {
  SYD: { MEL: 878, BNE: 923, PER: 4016, ADL: 1376, CBR: 281, HBA: 1160, DRW: 3934, ASP: 2762, NHU: 4553, KTR: 3544 },
  MEL: { SYD: 878, BNE: 1765, PER: 3509, ADL: 727, CBR: 654, HBA: 597, DRW: 3752, ASP: 2255, NHU: 4371, KTR: 3362 },
  BNE: { SYD: 923, MEL: 1765, PER: 4311, ADL: 2045, CBR: 1185, HBA: 2103, DRW: 3426, ASP: 2730, NHU: 4225, KTR: 3217 },
  PER: { SYD: 4016, MEL: 3509, BNE: 4311, ADL: 2716, CBR: 3787, HBA: 4106, DRW: 4032, ASP: 2481, NHU: 4950, KTR: 3841 },
  ADL: { SYD: 1376, MEL: 727, BNE: 2045, PER: 2716, CBR: 1188, HBA: 1328, DRW: 3025, ASP: 1528, NHU: 3644, KTR: 2635 },
  CBR: { SYD: 281, MEL: 654, BNE: 1185, PER: 3787, ADL: 1188, HBA: 1130, DRW: 3955, ASP: 2783, NHU: 4574, KTR: 3565 },
  HBA: { SYD: 1160, MEL: 597, BNE: 2103, PER: 4106, ADL: 1328, CBR: 1130, DRW: 4349, ASP: 2852, NHU: 4968, KTR: 3959 },
  DRW: { SYD: 3934, MEL: 3752, BNE: 3426, PER: 4032, ADL: 3025, CBR: 3955, HBA: 4349, ASP: 1497, NHU: 1150, KTR: 317 },
  ASP: { SYD: 2762, MEL: 2255, BNE: 2730, PER: 2481, ADL: 1528, CBR: 2783, HBA: 2852, DRW: 1497, NHU: 2647, KTR: 1180 },
  NHU: { SYD: 4553, MEL: 4371, BNE: 4225, PER: 4950, ADL: 3644, CBR: 4574, HBA: 4968, DRW: 1150, ASP: 2647, KTR: 1467 },
  KTR: { SYD: 3544, MEL: 3362, BNE: 3217, PER: 3841, ADL: 2635, CBR: 3565, HBA: 3959, DRW: 317, ASP: 1180, NHU: 1467 },
};

export const CITY_NAMES = {
  SYD: 'Sydney',
  MEL: 'Melbourne',
  BNE: 'Brisbane',
  PER: 'Perth',
  ADL: 'Adelaide',
  CBR: 'Canberra',
  HBA: 'Hobart',
  DRW: 'Darwin',
  ASP: 'Alice Springs',
  NHU: 'Nhulunbuy',
  KTR: 'Katherine',
};

export const POPULAR_ROUTES = [
  { from: 'SYD', to: 'DRW', label: 'Sydney → Darwin' },
  { from: 'MEL', to: 'DRW', label: 'Melbourne → Darwin' },
  { from: 'BNE', to: 'DRW', label: 'Brisbane → Darwin' },
  { from: 'ADL', to: 'ASP', label: 'Adelaide → Alice Springs' },
  { from: 'PER', to: 'DRW', label: 'Perth → Darwin' },
  { from: 'DRW', to: 'ASP', label: 'Darwin → Alice Springs' },
  { from: 'DRW', to: 'KTR', label: 'Darwin → Katherine' },
  { from: 'DRW', to: 'NHU', label: 'Darwin → Nhulunbuy' },
  { from: 'ASP', to: 'NHU', label: 'Alice Springs → Nhulunbuy' },
  { from: 'KTR', to: 'NHU', label: 'Katherine → Nhulunbuy' },
];
