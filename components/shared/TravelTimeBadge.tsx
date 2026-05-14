"use client";

import { useEffect, useState } from "react";
import { Car, Loader2 } from "lucide-react";

interface Props {
  origin: string;
  destination: string;
  label?: string; // e.g. "from last job" or "from home"
}

export default function TravelTimeBadge({ origin, destination, label = "from last job" }: Props) {
  const [result, setResult] = useState<{ durationMin: number; distanceKm: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!origin || !destination) { setLoading(false); setFailed(true); return; }

    fetch("/api/travel-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.durationMin !== undefined) setResult(data);
        else setFailed(true);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [origin, destination]);

  if (failed) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-sm font-semibold text-sky-700">
      <Car className="h-4 w-4 shrink-0" />
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : result ? (
        <>~{result.durationMin} min · {result.distanceKm} km {label}</>
      ) : null}
    </span>
  );
}
