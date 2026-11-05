"use client";

import { useRef, useState } from "react";
import "./before-after.css";

const NOTES = [
  { at: 22, was: "Phone number hidden on another page.", now: "Customers can now find your phone number." },
  { at: 44, was: "Tiny text you have to pinch to read.", now: "Reads properly on any phone." },
  { at: 66, was: "Nobody can tell what you actually sell.", now: "People see what you sell straight away." },
  { at: 88, was: "Looks closed, even when you are open.", now: "Looks like a business worth paying." },
];

const MARQUEE = "*** WELCOME TO THE OFFICIAL WEB SITE OF JOSHI SWEET MART *** BEST QUALITY *** BEST SERVICE *** NEW PAGE COMING SOON *** ";

export default function BeforeAfter() {
  const [p, setP] = useState(6);
  const stage = useRef<HTMLDivElement>(null);
  const dragging = useRef<number | null>(null);

  const fromPointer = (x: number) => {
    const r = stage.current!.getBoundingClientRect();
    setP(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };

  return (
    <>
      <p className="ba-vh">The same made-up sweet shop as a messy old website and as a clean new one. Move the slider to wipe from one to the other.</p>
      <div
        ref={stage}
        className="ba-stage"
        data-portal-off
        style={{ "--p": `${p}%` } as React.CSSProperties}
        onPointerDown={(e) => {
          dragging.current = e.pointerId;
          e.currentTarget.setPointerCapture(e.pointerId);
          // A finger may be starting a scroll, so only a mouse jumps straight to the spot.
          if (e.pointerType !== "touch") fromPointer(e.clientX);
        }}
        onPointerMove={(e) => { if (e.pointerId === dragging.current) fromPointer(e.clientX); }}
        onPointerUp={() => { dragging.current = null; }}
        onPointerCancel={() => { dragging.current = null; }}
      >
        <div className="ba-site ba-old" aria-hidden="true">
          <div className="ba-marq"><span>{MARQUEE}{MARQUEE}</span></div>
          <p className="ba-title">JOSHI SWEET MART</p>
          <p className="ba-est">!!! A Name Of Trust And Quality Since Long Time !!!</p>
          <div className="ba-cols">
            <div className="ba-nav"><u>Home</u><u>About Us</u><u>Our Vision</u><u>Gallery</u><u>Downloads</u><u>Contact Us</u><b>NEW!!</b></div>
            <div className="ba-body">
              <strong>~ Welcome Dear Visitors ~</strong>
              We are pleased to inform that our esteemed organisation is a leading manufacturer, supplier and trader of all kinds of quality products as per the requirement of valued customers. Our dedicated team believes in total customer satisfaction through excellence in every field of activity and our vision is to be the best in the industry.
              <span className="ba-broken"><i>x</i>photo1_final_new.jpg</span>
              For more information kindly go to the Contact Us page and fill the enquiry form and our executive will revert in due course of time. Thanking you for your visit.
            </div>
            <div className="ba-side">
              <div className="ba-work"><span>PAGE UNDER CONSTRUCTION</span></div>
              <div className="ba-count">Visitors: 0004817</div>
              <div className="ba-best">Best viewed in Internet Explorer at 800 x 600</div>
              <div className="ba-work"><span>SIGN OUR GUESTBOOK</span></div>
              <div className="ba-best">Hot Links: Weather &bull; Railway Time Table &bull; Free Screensavers</div>
            </div>
          </div>
          <div className="ba-pop"><b><span>Message</span><span>X</span></b><p>SUBSCRIBE TO OUR NEWSLETTER NOW!!!</p></div>
          <div className="ba-pho">For phone number kindly see Contact Us page &bull; Copyright all rights reserved</div>
        </div>

        <div className="ba-site ba-new" aria-hidden="true">
          <div className="ba-new-nav"><b>Joshi&rsquo;s</b><span>Menu</span><span>Order</span><span>Visit</span><span className="ba-call">Call the shop</span></div>
          <div className="ba-hero">
            <div className="ba-hero-text">
              <p className="ba-kick">Mithai &amp; namkeen</p>
              <p className="ba-hl">Fresh <i>every</i><br />morning.</p>
              <p className="ba-sub">Sweets made in our own kitchen. Order by noon and collect them the same evening.</p>
              <div className="ba-btns"><span>Order on WhatsApp</span><span>Today&rsquo;s menu</span></div>
            </div>
            <div className="ba-menu"><p>Made today</p><ul><li>Kaju katli</li><li>Motichoor ladoo</li><li>Khaman dhokla</li><li>Fresh jalebi</li></ul></div>
          </div>
          <div className="ba-strip"><span><b>Open today</b> till 10 PM</span><span>Two minutes from the station</span><span>Free parking</span></div>
        </div>

        {p >= 16 && <span className="ba-tag new" aria-hidden="true">After</span>}
        {p <= 84 && <span className="ba-tag old" aria-hidden="true">Before</span>}
        <input
          className="ba-range"
          type="range"
          min={0}
          max={100}
          value={Math.round(p)}
          aria-label="Wipe from the old website to the new one"
          aria-valuetext={`${Math.round(p)}% of the new website showing`}
          onChange={(e) => setP(+e.target.value)}
        />
        <div className="ba-handle" aria-hidden="true"><span className="ba-grip">⇆</span></div>
      </div>

      <ul className="ba-notes">
        {NOTES.map((n, i) => (
          <li key={n.at} className={p >= n.at ? "ba-note on" : "ba-note"}>
            <small className="label">Fix {i + 1}</small>
            <p className="ba-texts"><span className="was">{n.was}</span><span className="now">{n.now}</span></p>
          </li>
        ))}
      </ul>
    </>
  );
}
