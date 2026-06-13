import { WeeklyAvailability } from "./types";

export const DAY_KEYS = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"] as const;

export function generateSlots(start: string, end: string): string[] {
  const [startH] = start.split(":").map(Number);
  const [endH] = end.split(":").map(Number);
  const slots: string[] = [];
  for (let h = startH; h < endH; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
}

export function getTakenHours(
  date: string,
  bookings: Array<{ scheduledAt: unknown; status?: string; durationHours?: number }>
): Set<string> {
  const taken = new Set<string>();
  bookings.forEach((b) => {
    if (b.status === "cancelled") return;
    const ts = b.scheduledAt as { seconds?: number; toDate?: () => Date } | null;
    if (!ts) return;
    let d: Date;
    if (typeof ts.toDate === "function") d = ts.toDate();
    else if (ts.seconds) d = new Date(ts.seconds * 1000);
    else return;
    const localDate = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
    if (localDate === date) {
      const startHour = d.getHours();
      const dur = b.durationHours ?? 1;
      for (let i = 0; i < dur; i++) {
        taken.add(`${String(startHour + i).padStart(2, "0")}:00`);
      }
    }
  });
  return taken;
}

export function findAsapSlot(
  availability: WeeklyAvailability | undefined,
  existingBookings: Array<{ scheduledAt: unknown; status?: string; durationHours?: number }>,
  durationHours = 1
): { date: string; slot: string } | null {
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dateStr = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");

    const dayKey = DAY_KEYS[d.getDay()];

    let slots: string[];
    if (!availability) {
      slots = generateSlots("08:00", "18:00");
    } else {
      const schedule = availability[dayKey];
      if (!schedule.enabled) continue;
      slots = generateSlots(schedule.start, schedule.end);
    }

    const slotSet = new Set(slots);
    const taken = getTakenHours(dateStr, existingBookings);
    const currentHour = i === 0 ? now.getHours() : -1;

    for (const slot of slots) {
      const [h] = slot.split(":").map(Number);
      if (h <= currentHour) continue;
      const allFree = Array.from({ length: durationHours }, (_, k) => {
        const sh = `${String(h + k).padStart(2, "0")}:00`;
        return slotSet.has(sh) && !taken.has(sh);
      }).every(Boolean);
      if (allFree) return { date: dateStr, slot };
    }
  }
  return null;
}

export function formatSlot(slot: string): string {
  const [h] = slot.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${period}`;
}

export function formatSlotRange(slot: string, duration: number): string {
  const [h] = slot.split(":").map(Number);
  const fmt = (hour: number) => {
    const p = hour < 12 ? "AM" : "PM";
    const disp = hour % 12 === 0 ? 12 : hour % 12;
    return `${disp}:00 ${p}`;
  };
  return duration === 1 ? fmt(h) : `${fmt(h)} – ${fmt(h + duration)} (${duration}h)`;
}
