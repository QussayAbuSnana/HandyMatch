import { NextRequest, NextResponse } from "next/server";

async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
  // Append Israel to improve geocoding accuracy for Israeli addresses
  const query = address.includes("Israel") ? address : `${address}, Israel`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=il`;
  const res = await fetch(url, {
    headers: { "User-Agent": "HandyMatch/1.0 (contact@handymatch.dev)" },
  });
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

export async function POST(req: NextRequest) {
  const { origin, destination } = await req.json() as { origin: string; destination: string };

  if (!origin?.trim() || !destination?.trim()) {
    return NextResponse.json({ error: "origin and destination are required" }, { status: 400 });
  }

  try {
    const [from, to] = await Promise.all([geocode(origin), geocode(destination)]);

    if (!from || !to) {
      return NextResponse.json({ error: "Could not geocode one or both addresses." }, { status: 422 });
    }

    const osrmUrl =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`;

    const osrmRes = await fetch(osrmUrl);
    const osrmData = await osrmRes.json();

    const route = osrmData.routes?.[0];
    if (!route) return NextResponse.json({ error: "No route found." }, { status: 422 });

    const durationMin = Math.round(route.duration / 60);
    const distanceKm = (route.distance / 1000).toFixed(1);

    return NextResponse.json({ durationMin, distanceKm });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("travel-time error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
