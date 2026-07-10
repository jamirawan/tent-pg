// src/pages/api/fuel-stations.ts
export async function GET({ url }: { url: URL }) {
  const state = url.searchParams.get('state') ?? 'NSW';

  const params = new URLSearchParams({
    where: `station_state='${state}' AND operational_status='Operational'`,
    outFields: 'station_name,station_owner,station_address,station_suburb,station_postcode,station_state',
    f: 'geojson',
    resultRecordCount: '2000',
  });

  const upstream = `https://services.ga.gov.au/gis/rest/services/Liquid_Fuel_Facilities/MapServer/3/query?${params}`;
  const res = await fetch(upstream);
  const data = await res.json();

  console.log('Upstream response:', data);

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400', // Cache 24h — this data rarely changes
    },
  });
}