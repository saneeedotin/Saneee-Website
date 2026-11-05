import { EMAIL } from "./ReachList";

const UPDATED = "6 November 2026";

/** The same policy in both worlds; only the heading changes voice. */
export default function Privacy({ heading }: { heading: React.ReactNode }) {
  return (
    <section className="section page-top chapter">
      <p className="label">Privacy</p>
      <div className="prose">
        {heading}
        <p className="label">Last updated {UPDATED}</p>

        <h2 className="h4">What we collect</h2>
        <p>Only what you type into the contact form: your message, your name, your email address and, if you give it, your business name. Nothing else is collected about you.</p>

        <h2 className="h4">How it reaches us</h2>
        <p>The form sends your message through a small script in our own Google account, which emails it to our Gmail inbox ({EMAIL}). No other service sees it. If you email us directly, your message goes straight to Gmail.</p>

        <h2 className="h4">What we do with it</h2>
        <p>We use your details to reply to you and to talk about your project. We never sell them, share them with advertisers or add you to a mailing list.</p>

        <h2 className="h4">Cookies and tracking</h2>
        <p>This site sets no cookies and runs no analytics or advertising trackers. Your browser remembers, for this visit only, that you have seen the opening animation, so it does not play again.</p>

        <h2 className="h4">Your choice</h2>
        <p>You can ask us at any time what we hold about you, or ask us to delete it, by writing to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We will do it and confirm.</p>
      </div>
    </section>
  );
}
