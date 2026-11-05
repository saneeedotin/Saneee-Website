// The contact form's mail handler. Deploy as a Google Apps Script web app (see README.md).
// It runs in the studio's Google account and sends with that account's Gmail.

const TO = "saneeedotin@gmail.com";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    // Newlines are stripped so nothing can break out into the mail's headers.
    const clean = (value, max) => String(value || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
    // Bots fill the hidden field; they get a success and nothing is sent.
    if (clean(data.website, 200)) return reply(true);

    const name = clean(data.name, 100);
    const email = clean(data.email, 200);
    const business = clean(data.business, 200) || "Not given";
    const message = String(data.message || "").trim().slice(0, 1000);
    if (!name || !message || !EMAIL.test(email)) return reply(false, "Missing or invalid fields");

    MailApp.sendEmail({
      to: TO,
      replyTo: email,
      subject: "New website enquiry from " + name,
      body: "Name: " + name + "\nEmail: " + email + "\nBusiness: " + business + "\n\n" + message,
    });
    return reply(true);
  } catch (err) {
    return reply(false, "Could not send");
  }
}

function reply(ok, error) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok, error: error || null })).setMimeType(ContentService.MimeType.JSON);
}
