import QuestionnaireForm from "@/components/QuestionnaireForm";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-ornament" aria-hidden="true">A · H</div>
        <p className="eyebrow">{siteConfig.eyebrow}</p>
        <h1>{siteConfig.coupleNames}</h1>
        <p className="hero-date">{siteConfig.weddingDate} · {siteConfig.location}</p>
        <div className="divider"><span>♡</span></div>
        <p className="intro">{siteConfig.intro}</p>
        <p className="deadline">Please respond by {siteConfig.responseDeadline}</p>
      </section>

      <QuestionnaireForm />

      <footer>Formal invitation and RSVP to follow.</footer>
    </main>
  );
}
