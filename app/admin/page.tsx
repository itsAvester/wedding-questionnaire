import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getResponses } from "@/lib/supabase-rest";

function fmt(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(date));
}

function pct(value: number, total: number) {
  return total ? `${Math.round((value / total) * 100)}%` : "0%";
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const responses = await getResponses();
  const total = responses.length;
  const yes = responses.filter((r) => r.attendance === "yes");
  const maybe = responses.filter((r) => r.attendance === "maybe");
  const hotel = responses.filter((r) => r.hotel_interest !== "no");
  const likelyGuests = yes.reduce((sum, r) => sum + r.estimated_guests, 0);
  const possibleGuests = maybe.reduce((sum, r) => sum + r.estimated_guests, 0);
  const likelyRooms = responses.filter((r) => r.hotel_interest === "yes").reduce((sum, r) => sum + r.rooms_needed, 0);
  const possibleRooms = responses.filter((r) => r.hotel_interest === "maybe").reduce((sum, r) => sum + r.rooms_needed, 0);
  const shuttle = responses.filter((r) => r.transportation_interest).length;

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">PRIVATE DASHBOARD</p>
          <h1>Questionnaire responses</h1>
          <p>{total} household{total === 1 ? "" : "s"} have responded.</p>
        </div>
        <div className="admin-actions">
          <a className="secondary-button" href="/api/admin/export">Export CSV</a>
          <form action="/api/admin/logout" method="post"><button className="secondary-button">Log out</button></form>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat"><span>Likely guests</span><strong>{likelyGuests}</strong><small>+ {possibleGuests} maybe</small></article>
        <article className="stat"><span>Hotel rooms</span><strong>{likelyRooms}</strong><small>+ {possibleRooms} maybe</small></article>
        <article className="stat"><span>Hotel interest</span><strong>{hotel.length}</strong><small>{pct(hotel.length, total)} of households</small></article>
        <article className="stat"><span>Shuttle interest</span><strong>{shuttle}</strong><small>{pct(shuttle, total)} of households</small></article>
      </section>

      {responses.length === 0 ? (
        <section className="card empty-state"><h2>No responses yet</h2><p>Once guests submit the questionnaire, they’ll appear here.</p></section>
      ) : (
        <section className="response-list">
          {responses.map((r) => (
            <article className="response-card" key={r.id}>
              <div className="response-topline">
                <div><h2>{r.household_name}</h2><p>{r.contact_name} · {fmt(r.created_at)}</p></div>
                <span className={`pill ${r.attendance}`}>{r.attendance}</span>
              </div>
              <div className="response-grid">
                <div><span>Estimated guests</span><strong>{r.estimated_guests}</strong>{r.guest_names && <p>{r.guest_names}</p>}</div>
                <div><span>Hotel</span><strong>{r.hotel_interest} · {r.rooms_needed} room{r.rooms_needed === 1 ? "" : "s"}</strong><p>{r.hotel_nights.join(", ") || "No nights selected"}</p></div>
                <div><span>Contact</span><strong>{r.email || "No email"}</strong><p>{r.phone || "No phone"}</p></div>
                <div><span>Mailing address</span><p>{r.mailing_address || "—"}</p></div>
                <div><span>Allergies / dietary</span><p>{[r.allergies, r.dietary_restrictions].filter(Boolean).join(" · ") || "—"}</p></div>
                <div><span>Accessibility / transportation</span><p>{r.accessibility_needs || "—"}{r.transportation_interest ? " · Interested in shuttle" : ""}</p></div>
              </div>
              {r.notes && <div className="response-notes"><span>Notes</span><p>{r.notes}</p></div>}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
