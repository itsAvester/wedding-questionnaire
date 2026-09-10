"use client";

import { FormEvent, useState } from "react";

type Attendance = "yes" | "maybe" | "no";
type Interest = "yes" | "maybe" | "no";

const initialForm = {
  household_name: "",
  contact_name: "",
  email: "",
  phone: "",
  attendance: "yes" as Attendance,
  estimated_guests: 2,
  guest_names: "",
  hotel_interest: "maybe" as Interest,
  rooms_needed: 1,
  hotel_nights: [] as string[],
  transportation_interest: false,
  dietary_restrictions: "",
  allergies: "",
  accessibility_needs: "",
  mailing_address: "",
  notes: "",
};

export default function QuestionnaireForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleNight(night: string) {
    setForm((prev) => ({
      ...prev,
      hotel_nights: prev.hotel_nights.includes(night)
        ? prev.hotel_nights.filter((n) => n !== night)
        : [...prev.hotel_nights, night],
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit right now.");
    }
  }

  if (status === "success") {
    return (
      <section className="card success-card" aria-live="polite">
        <div className="success-icon">✓</div>
        <p className="eyebrow">THANK YOU</p>
        <h2>We got your response!</h2>
        <p>This gives us a much better idea of what to plan. We’ll send the formal invitation and RSVP later.</p>
        <button className="secondary-button" onClick={() => { setForm(initialForm); setStatus("idle"); }}>
          Submit another household
        </button>
      </section>
    );
  }

  return (
    <form className="card form-card" onSubmit={submit}>
      <section className="form-section">
        <p className="section-number">01</p>
        <div>
          <h2>Your household</h2>
          <p className="section-note">One response per household is perfect.</p>
        </div>

        <label className="field full">
          <span>Household / family name *</span>
          <input required value={form.household_name} onChange={(e) => update("household_name", e.target.value)} placeholder="The Smith Family" />
        </label>
        <label className="field">
          <span>Primary contact name *</span>
          <input required value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} placeholder="Jordan Smith" />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jordan@example.com" />
        </label>
        <label className="field">
          <span>Phone</span>
          <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(303) 555-0123" />
        </label>
        <label className="field">
          <span>Mailing address</span>
          <input value={form.mailing_address} onChange={(e) => update("mailing_address", e.target.value)} placeholder="For the formal invitation" />
        </label>
      </section>

      <section className="form-section">
        <p className="section-number">02</p>
        <div>
          <h2>Estimated attendance</h2>
          <p className="section-note">This is only an early estimate — plans can change.</p>
        </div>

        <fieldset className="full">
          <legend>Do you currently expect to attend? *</legend>
          <div className="choice-grid three">
            {(["yes", "maybe", "no"] as Attendance[]).map((value) => (
              <label className={`choice ${form.attendance === value ? "selected" : ""}`} key={value}>
                <input type="radio" name="attendance" value={value} checked={form.attendance === value} onChange={() => update("attendance", value)} />
                <strong>{value === "yes" ? "Yes" : value === "maybe" ? "Maybe" : "Probably not"}</strong>
              </label>
            ))}
          </div>
        </fieldset>

        {form.attendance !== "no" && (
          <>
            <label className="field">
              <span>How many in your invited party will be attending? *</span>
              <input type="number" min={1} max={20} required value={form.estimated_guests} onChange={(e) => update("estimated_guests", Number(e.target.value))} />
            </label>
            <label className="field">
              <span>Likely guest names</span>
              <input value={form.guest_names} onChange={(e) => update("guest_names", e.target.value)} placeholder="Jordan, Taylor, ..." />
            </label>
          </>
        )}
      </section>

      <section className="form-section">
        <p className="section-number">03</p>
        <div>
          <h2>Hotel block</h2>
          <p className="section-note">We’re gauging demand before reserving room inventory. There is also an RV park nearby for guests who would prefer to stay there.</p>
        </div>

        <fieldset className="full">
          <legend>Would you be interested in booking through our hotel block?</legend>
          <div className="choice-grid three">
            {(["yes", "maybe", "no"] as Interest[]).map((value) => (
              <label className={`choice ${form.hotel_interest === value ? "selected" : ""}`} key={value}>
                <input type="radio" name="hotel_interest" value={value} checked={form.hotel_interest === value} onChange={() => update("hotel_interest", value)} />
                <strong>{value === "yes" ? "Yes" : value === "maybe" ? "Maybe" : "No"}</strong>
              </label>
            ))}
          </div>
        </fieldset>

        {form.hotel_interest !== "no" && (
          <>
            <label className="field">
              <span>How many rooms might you need?</span>
              <input type="number" min={1} max={10} value={form.rooms_needed} onChange={(e) => update("rooms_needed", Number(e.target.value))} />
            </label>
            <fieldset className="field">
              <legend>Which nights might you stay?</legend>
              <div className="check-stack">
                {["August 20, 2027 — Night before wedding", "August 21, 2027 — Wedding night", "August 22, 2027 — Night after wedding"].map((night) => (
                  <label key={night} className="checkbox-row">
                    <input type="checkbox" checked={form.hotel_nights.includes(night)} onChange={() => toggleNight(night)} />
                    <span>{night}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        <label className="checkbox-row full standalone-check">
          <input type="checkbox" checked={form.transportation_interest} onChange={(e) => update("transportation_interest", e.target.checked)} />
          <span>I may be interested in group transportation / a wedding shuttle.</span>
        </label>
      </section>

      <section className="form-section">
        <p className="section-number">04</p>
        <div>
          <h2>Accommodations</h2>
          <p className="section-note">Help us plan food and accessibility thoughtfully.</p>
        </div>

        <label className="field">
          <span>Food allergies</span>
          <textarea rows={3} value={form.allergies} onChange={(e) => update("allergies", e.target.value)} placeholder="Please include the person and allergy." />
        </label>
        <label className="field">
          <span>Dietary restrictions / preferences</span>
          <textarea rows={3} value={form.dietary_restrictions} onChange={(e) => update("dietary_restrictions", e.target.value)} placeholder="Vegetarian, gluten-free, etc." />
        </label>
        <label className="field full">
          <span>Accessibility or mobility needs</span>
          <textarea rows={3} value={form.accessibility_needs} onChange={(e) => update("accessibility_needs", e.target.value)} placeholder="Anything that would help us make the day more comfortable for you." />
        </label>
      </section>

      <section className="form-section last-section">
        <p className="section-number">05</p>
        <div>
          <h2>Anything else?</h2>
        </div>
        <label className="field full">
          <span>Notes or questions</span>
          <textarea rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Travel questions, room requests, anything we should know..." />
        </label>
      </section>

      {status === "error" && <p className="error-banner" role="alert">{message}</p>}
      <button className="submit-button" disabled={status === "sending"} type="submit">
        {status === "sending" ? "Sending…" : "Send our response"}
      </button>
      <p className="privacy-note">Your answers are only being collected for wedding planning.</p>
    </form>
  );
}
