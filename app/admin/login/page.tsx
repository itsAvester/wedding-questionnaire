export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="login-shell">
      <form className="card login-card" action="/api/admin/login" method="post">
        <p className="eyebrow">PRIVATE</p>
        <h1>Wedding dashboard</h1>
        <p>Enter the admin password to view questionnaire responses.</p>
        <label className="field full">
          <span>Password</span>
          <input type="password" name="password" required autoFocus />
        </label>
        {params.error && <p className="error-banner">Incorrect password.</p>}
        <button className="submit-button" type="submit">Open dashboard</button>
      </form>
    </main>
  );
}
