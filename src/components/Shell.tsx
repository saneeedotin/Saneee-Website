import Footer from "./Footer";
import Nav from "./Nav";
import type { World } from "./portal/world";

export default function Shell({ world, children }: { world: World; children: React.ReactNode }) {
  return (
    <div className={world}>
      <a className="skip" href="#main">Skip to content</a>
      <Nav world={world} />
      <main id="main">{children}</main>
      <Footer world={world} />
    </div>
  );
}
