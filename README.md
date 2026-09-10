# Save the Date Questionnaire

A mobile-first wedding planning questionnaire built with Next.js and Supabase. Guests do **not** need accounts. The browser never receives your Supabase service key.

## Included

- Estimated attendance and guest count
- Hotel-block interest, room count, and likely nights
- Shuttle / transportation interest
- Food allergies and dietary restrictions
- Accessibility or mobility needs
- Mailing address and general notes
- Password-protected `/admin` dashboard
- Summary metrics for attendance and hotel demand
- CSV export
- Responsive layout for links sent by text message

## 1. Create the Supabase table

Create a Supabase project, open the SQL Editor, and run:

`supabase/schema.sql`

No public RLS policies are needed. All database calls are made by your Next.js server.

## 2. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set:

- `SUPABASE_URL` — Project Settings → API → Project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API → service role key. **Never expose this in client code.**
- `ADMIN_PASSWORD` — password used at `/admin/login`
- `ADMIN_COOKIE_SECRET` — another long random string for signing the admin session token

## 3. Customize wedding details

Edit `lib/site-config.ts`:

```ts
export const siteConfig = {
  coupleNames: "Averey & Hailey",
  eyebrow: "SAVE THE DATE",
  weddingDate: "August 21st, 2027",
  location: "Colorado",
  responseDeadline: "October 15, 2026",
  intro: "...",
};
```

The hotel-night labels are set to August 20–22, 2027 around the August 21st wedding date. They can be changed in `components/QuestionnaireForm.tsx`.

## 4. Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Admin dashboard: `http://localhost:3000/admin`

## 5. Production build

```bash
npm run build
npm start
```

## 6. Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repo into Vercel.
3. Add the four environment variables from `.env.local` in Vercel Project Settings → Environment Variables.
4. Deploy.
5. Text the deployed root URL to guests.

## Security notes

- The service-role key is used only in server code.
- Supabase RLS is enabled and no anonymous read/write policies are created.
- The `/admin` page uses an HttpOnly session cookie derived from your admin secret.
- For a family-only questionnaire this is intentionally simple. If you later want multiple administrators, individual guest records, invitation-code validation, or automatic email reminders, add Supabase Auth or a guest-code table.
