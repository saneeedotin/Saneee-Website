"use client";

import { useEffect, useRef, useState } from "react";

// The Google Apps Script web app in tools/contact-form, which mails the studio inbox.
const ENDPOINT = "https://script.google.com/macros/s/AKfycbxBXqgrLRa7zKd_yhbpX8NbKIb8AmSEEsIOnKRdxLaJNjjGrU_Crza03Lg92J8N4F42kA/exec";
const TIMEOUT_MS = 15000;

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "failed" | "sent">("idle");
  const done = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "sent") done.current?.focus({ preventScroll: true });
  }, [state]);

  const finish = (form: HTMLFormElement) => {
    form.reset();
    setState("sent");
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    // Bots fill the hidden field; they see success and nothing is sent.
    if (text("website")) return finish(form);

    setState("sending");
    const timer = new AbortController();
    const stop = setTimeout(() => timer.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        signal: timer.signal,
        // Plain text keeps this a "simple" request: Apps Script can't answer a CORS preflight.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          name: text("name"),
          email: text("email"),
          business: text("business"),
          message: text("message"),
        }),
      });
      const reply = await res.json().catch(() => ({}));
      if (res.ok && reply.ok === true) finish(form);
      else setState("failed");
    } catch {
      setState("failed");
    } finally {
      clearTimeout(stop);
    }
  };

  if (state === "sent") {
    return (
      <div className="form-done" ref={done} role="status" tabIndex={-1} data-portal-off>
        <p className="h3">Thank you for contacting saneee.in.</p>
        <p>Our team will contact you at the earliest.</p>
        <button className="button-ghost" type="button" onClick={() => setState("idle")}>Send another</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} data-portal-off>
      <div className="field">
        <label className="label" htmlFor="f-message">Tell us what&rsquo;s going on</label>
        <textarea id="f-message" name="message" rows={5} maxLength={1000} required />
      </div>
      <div className="field-row">
        <div className="field">
          <label className="label" htmlFor="f-name">Your name</label>
          <input id="f-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label className="label" htmlFor="f-email">Your email</label>
          <input id="f-email" name="email" type="email" autoComplete="email" inputMode="email" required />
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="f-business">Your business (optional)</label>
        <input id="f-business" name="business" type="text" autoComplete="organization" />
      </div>
      <div className="vh" aria-hidden="true">
        <label htmlFor="f-website">Leave this empty</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="button" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Send it to us"} <span aria-hidden="true">→</span>
      </button>
      {state === "failed" && (
        <p className="form-error" role="alert">
          That didn&rsquo;t send, and your message is still here. Please try again, or email us at saneeedotin@gmail.com.
        </p>
      )}
    </form>
  );
}
