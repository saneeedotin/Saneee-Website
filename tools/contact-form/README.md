# Contact form mail handler

The site is static, so the contact form posts to a Google Apps Script web app that sends the message to saneeedotin@gmail.com with Gmail.

## Deploy (once)

1. Signed in as saneeedotin@gmail.com, open https://script.google.com and click **New project**.
2. Replace everything in `Code.gs` with this folder's `Code.gs`. Name the project `saneee.in contact form`.
3. Click **Deploy → New deployment**. For the type, choose **Web app**.
4. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**.
5. Google asks you to authorise. Choose your account, then **Advanced → Go to saneee.in contact form (unsafe) → Allow**. It says "unsafe" only because the script is yours and unverified; it only gets permission to send mail as you.
6. Copy the **Web app URL** (it ends in `/exec`) into `ENDPOINT` in `src/components/ContactForm.tsx`.

## Changing the script later

Edit it, then use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. This keeps the same URL. A *new deployment* would get a new URL.

## Limits

A personal Gmail account can send about 100 of these mails a day. The URL is public, like any form endpoint. The hidden "leave this empty" field filters simple bots.
