export type QuestionnaireResponse = {
  id: string;
  created_at: string;
  household_name: string;
  contact_name: string;
  email: string | null;
  phone: string | null;
  attendance: "yes" | "maybe" | "no";
  estimated_guests: number;
  guest_names: string | null;
  hotel_interest: "yes" | "maybe" | "no";
  rooms_needed: number;
  hotel_nights: string[];
  transportation_interest: boolean;
  dietary_restrictions: string | null;
  allergies: string | null;
  accessibility_needs: string | null;
  mailing_address: string | null;
  notes: string | null;
};

function env() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return { url: url.replace(/\/$/, ""), key };
}

function headers(prefer?: string) {
  const { key } = env();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export async function insertResponse(payload: Omit<QuestionnaireResponse, "id" | "created_at">) {
  const { url } = env();
  const response = await fetch(`${url}/rest/v1/questionnaire_responses`, {
    method: "POST",
    headers: headers("return=minimal"),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase insert failed (${response.status}): ${detail}`);
  }
}

export async function getResponses(): Promise<QuestionnaireResponse[]> {
  const { url } = env();
  const response = await fetch(
    `${url}/rest/v1/questionnaire_responses?select=*&order=created_at.desc`,
    { headers: headers(), cache: "no-store" }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase read failed (${response.status}): ${detail}`);
  }

  return response.json();
}
