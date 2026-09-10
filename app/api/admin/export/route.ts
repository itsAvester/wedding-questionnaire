import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getResponses } from "@/lib/supabase-rest";

function csvCell(value: unknown) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.redirect(new URL("/admin/login", request.url));
  const rows = await getResponses();
  const columns = [
    "created_at", "household_name", "contact_name", "email", "phone", "attendance", "estimated_guests", "guest_names",
    "hotel_interest", "rooms_needed", "hotel_nights", "transportation_interest", "allergies", "dietary_restrictions",
    "accessibility_needs", "mailing_address", "notes",
  ] as const;

  const csv = [
    columns.map(csvCell).join(","),
    ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wedding-questionnaire-responses.csv"`,
    },
  });
}
