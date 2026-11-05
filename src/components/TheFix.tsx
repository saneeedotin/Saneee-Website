const FIXES = [
  { was: "Phone number hidden on another page.", now: "Customers can now find your phone number." },
  { was: "Tiny text you have to pinch to read.", now: "Reads properly on any phone." },
  { was: "Nobody can tell what you actually sell.", now: "People see what you sell straight away." },
  { was: "Looks closed, even when you are open.", now: "Looks like a business worth paying." },
];

export default function TheFix() {
  return (
    <section id="fix" data-chapter="services" className="fix">
      <div className="fix-stage chapter">
        <p className="label">02 / The fix</p>
        <div>
          <h2 className="h-editorial">Same business. Now sane.</h2>
          <ol className="fix-rows">
            {FIXES.map((f) => (
              <li key={f.now} className="fix-row">
                <del>{f.was}</del>
                <ins>{f.now}</ins>
                <svg className="fix-cursor" viewBox="0 0 113 151" aria-hidden="true"><path d="M0 0 113 108H45L0 151Z" /></svg>
              </li>
            ))}
          </ol>
          <a className="button-ghost spaced" href="#contact">Do this to my website <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
