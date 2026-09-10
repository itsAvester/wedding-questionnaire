import { NextResponse } from "next/server";
import { insertResponse } from "@/lib/supabase-rest";

function text(value: unknown, max = 1000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function enumValue<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function numberInRange(value: unknown, min: number, max: number, fallback: number) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const householdName = text(body.household_name, 150);
    const contactName = text(body.contact_name, 150);

    if (!householdName || !contactName) {
      return NextResponse.json({ error: "Please provide your household and contact name." }, { status: 400 });
    }

    const attendance = enumValue(body.attendance, ["yes", "maybe", "no"] as const, "maybe");
    const hotelInterest = enumValue(body.hotel_interest, ["yes", "maybe", "no"] as const, "maybe");
    const allowedNights = ["Night before wedding", "Wedding night", "Night after wedding"];
    const hotelNights = Array.isArray(body.hotel_nights)
      ? body.hotel_nights.filter((night: unknown): night is string => typeof night === "string" && allowedNights.includes(night))
      : [];

    await insertResponse({
      household_name: householdName,
      contact_name: contactName,
      email: text(body.email, 254) || null,
      phone: text(body.phone, 40) || null,
      attendance,
      estimated_guests: attendance === "no" ? 0 : numberInRange(body.estimated_guests, 1, 20, 1),
      guest_names: text(body.guest_names, 600) || null,
      hotel_interest: hotelInterest,
      rooms_needed: hotelInterest === "no" ? 0 : numberInRange(body.rooms_needed, 1, 10, 1),
      hotel_nights: hotelInterest === "no" ? [] : hotelNights,
      transportation_interest: Boolean(body.transportation_interest),
      dietary_restrictions: text(body.dietary_restrictions, 1000) || null,
      allergies: text(body.allergies, 1000) || null,
      accessibility_needs: text(body.accessibility_needs, 1000) || null,
      mailing_address: text(body.mailing_address, 500) || null,
      notes: text(body.notes, 1500) || null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "We couldn't save your response. Please try again." }, { status: 500 });
  }
}
