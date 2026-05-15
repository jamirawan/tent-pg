const cars = [
  { id: 'city', name: 'City Car/Hatchback', icon: 'https://a.storyblok.com/f/286255898790625/800x800/ea5e65fa61/car-hatchback-city.svg', eff: 6.5, eg: 'Yaris, Polo' },
  { id: 'sedan', name: 'Sedan', icon: 'https://a.storyblok.com/f/286255898790625/800x800/69b049ceee/sedan-car.svg', eff: 8.0, eg: 'Camry, Mazda3' },
  { id: 'suv', name: 'SUV', icon: 'https://a.storyblok.com/f/286255898790625/800x800/bc07a8cec5/car-suv.svg', eff: 10.5, eg: 'RAV4, CX-5' },
  { id: 'truck', name: 'Ute / Truck', icon: 'https://a.storyblok.com/f/286255898790625/800x800/08f78fc224/truck-pickup-ute-truck.svg', eff: 12.5, eg: 'HiLux, Ranger' },
  { id: 'sports', name: 'Sports', icon: 'https://a.storyblok.com/f/286255898790625/800x800/69e5918ff4/car-sport.svg', eff: 11.0, eg: 'BRZ, MX-5' },
  { id: 'van', name: 'Van / Bus', icon: 'https://a.storyblok.com/f/286255898790625/800x800/48ed265920/van-bus-car.svg', eff: 14.0, eg: 'Hiace, Transit' },
  { id: 'hybrid', name: 'Hybrid', icon: 'https://a.storyblok.com/f/286255898790625/800x800/a9d8194a15/eco-car.svg', eff: 4.5, eg: 'Prius, Corolla' },
  { id: 'electric', name: 'Electric', icon: 'https://a.storyblok.com/f/286255898790625/800x800/36a42d7953/electric-car.svg', eff: 0, eg: 'Tesla, BYD', isEv: true },
];

const DIST = {
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

const CITY_NAMES = {
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

const POPULAR_ROUTES = [
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

let selectedCar = null;
let activePill = null;

function renderCars() {
  const grid = document.getElementById('carGrid');
  grid.innerHTML = cars
    .map((c) => {
      const isUrl = c.icon.startsWith('http://') || c.icon.startsWith('https://');
      const iconHtml = isUrl
        ? `<img src="${c.icon}" alt="${c.name}" class="car-icon-svg" />`
        : `<div class="car-icon-emoji">${c.icon}</div>`;
      return `
        <div class="car-option" id="car_${c.id}" onclick="selectCar('${c.id}')">
          <div class="car-icon">${iconHtml}</div>
          <div class="car-name">${c.name}</div>
          <div class="car-eff">${c.eff}${c.eff ? ' L/100km' : ''}</div>
        </div>
      `;
    })
    .join('');
}

function selectCar(id) {
  selectedCar = cars.find((c) => c.id === id);
  document.querySelectorAll('.car-option').forEach((el) => el.classList.remove('selected'));
  const element = document.getElementById('car_' + id);
  if (element) element.classList.add('selected');

  const note = document.getElementById('effNote');
  const effInput = document.getElementById('fuelEfficiency');

  if (selectedCar.isEv) {
    note.innerHTML = `⚡ Electric — <strong>no fuel cost</strong>`;
    effInput.placeholder = 'N/A';
    effInput.disabled = true;
    effInput.value = '';
  } else {
    note.innerHTML = `Default for <strong>${selectedCar.name}</strong>: <strong>${selectedCar.eff} L/100km</strong> (${selectedCar.eg})`;
    effInput.placeholder = selectedCar.eff;
    effInput.disabled = false;
  }
}

function renderQuickPills() {
  const wrap = document.getElementById('quickPills');
  wrap.innerHTML = POPULAR_ROUTES.map(
    (r, i) => `
      <button class="dest-pill" id="pill_${i}" onclick="selectPill(${i})">${r.label}</button>
    `
  ).join('');
}

function selectPill(idx) {
  const r = POPULAR_ROUTES[idx];
  document.getElementById('destFrom').value = r.from;
  document.getElementById('destTo').value = r.to;
  document.querySelectorAll('.dest-pill').forEach((p) => p.classList.remove('active'));
  const pill = document.getElementById('pill_' + idx);
  if (pill) pill.classList.add('active');
  activePill = idx;
  onRouteChange();
}

function onRouteChange() {
  const from = document.getElementById('destFrom').value;
  const to = document.getElementById('destTo').value;
  const strip = document.getElementById('destInfoStrip');
  const text = document.getElementById('destInfoText');

  if (activePill !== null) {
    const active = POPULAR_ROUTES[activePill];
    if (active.from !== from || active.to !== to) {
      document.querySelectorAll('.dest-pill').forEach((p) => p.classList.remove('active'));
      activePill = null;
    }
  }

  if (from && to && from !== to && DIST[from] && DIST[from][to]) {
    const km = DIST[from][to];
    strip.classList.add('visible');
    text.innerHTML = `<strong>${CITY_NAMES[from]}</strong> to <strong>${CITY_NAMES[to]}</strong> — approximately <strong>${km.toLocaleString()} km</strong> by road. Click "Use this route" to auto-fill the distance.`;
  } else {
    strip.classList.remove('visible');
  }
}

function applyRoute() {
  const from = document.getElementById('destFrom').value;
  const to = document.getElementById('destTo').value;
  if (!from || !to || from === to) {
    alert('Please select two different cities.');
    return;
  }
  if (!DIST[from] || !DIST[from][to]) {
    alert('Distance data not available for this route.');
    return;
  }
  document.getElementById('distance').value = DIST[from][to];
  document.getElementById('distance').scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.getElementById('distance').focus();
}

function swapCities() {
  const from = document.getElementById('destFrom');
  const to = document.getElementById('destTo');
  const tmp = from.value;
  from.value = to.value;
  to.value = tmp;
  onRouteChange();
}

function calculate() {
  const distance = parseFloat(document.getElementById('distance').value);
  const fuelPrice = parseFloat(document.getElementById('fuelPrice').value);
  const passengers = parseInt(document.getElementById('passengers').value) || 1;
  let efficiency = parseFloat(document.getElementById('fuelEfficiency').value);

  if (!selectedCar) {
    showError('Please select a vehicle type.');
    return;
  }
  if (!distance || distance <= 0) {
    showError('Please enter a valid distance.');
    return;
  }

  let totalCost, litersUsed, co2kg;

  if (selectedCar.isEv) {
    totalCost = 0;
    litersUsed = 0;
    co2kg = 0;
  } else {
    if (!fuelPrice || fuelPrice <= 0) {
      showError('Please enter a valid fuel price per litre.');
      return;
    }
    if (!efficiency || isNaN(efficiency)) efficiency = selectedCar.eff;
    litersUsed = (distance / 100) * efficiency;
    totalCost = litersUsed * fuelPrice;
    co2kg = litersUsed * 2.31;
  }

  const perPerson = passengers > 0 ? totalCost / passengers : totalCost;
  const barMax = Math.max(totalCost, 300);
  const barPct = Math.min((totalCost / barMax) * 100, 100);

  const from = document.getElementById('destFrom').value;
  const to = document.getElementById('destTo').value;
  const routeLabel =
    from && to && from !== to && DIST[from]?.[to]
      ? `${CITY_NAMES[from]} → ${CITY_NAMES[to]}`
      : `${distance.toLocaleString()} km · ${selectedCar.name}`;

  document.getElementById('resultBody').innerHTML = `
    <div class="result-grid">
      <div class="result-item">
        <div class="result-label">Total Cost</div>
        <div class="result-value highlight">$${totalCost.toFixed(2)}</div>
        <div class="result-unit">Total trip</div>
      </div>
      <div class="result-item">
        <div class="result-label">Per Person</div>
        <div class="result-value">$${perPerson.toFixed(2)}</div>
        <div class="result-unit">${passengers} ${passengers === 1 ? 'person' : 'people'}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Fuel Used</div>
        <div class="result-value">${litersUsed.toFixed(1)}</div>
        <div class="result-unit">litres</div>
      </div>
      <div class="result-item">
        <div class="result-label">CO₂ Emissions</div>
        <div class="result-value">${co2kg.toFixed(1)}</div>
        <div class="result-unit">kg</div>
      </div>
    </div>
    <div class="breakdown">
      <div class="breakdown-label">${routeLabel}</div>
      <div class="bar-track">
        <div class="bar-fill" id="barFill"></div>
      </div>
      <div class="bar-meta">
        <span>$0</span>
        <span>$${barMax.toFixed(0)}</span>
      </div>
    </div>
  `;

  setTimeout(() => {
    const bar = document.getElementById('barFill');
    if (bar) bar.style.width = barPct + '%';
  }, 50);
}

function showError(msg) {
  document.getElementById('resultBody').innerHTML = `
    <div class="empty-state" style="color:var(--brand-pink)">
      <div class="big">⚠️</div>
      <div>${msg}</div>
    </div>`;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') calculate();
});

document.addEventListener('DOMContentLoaded', () => {
  renderCars();
  renderQuickPills();
});
