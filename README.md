
# Rotary Divyang Center Website

This is the official Next.js website for Rotary Divyang Center, a non-profit initiative providing free prosthetic limbs and rehabilitation services in India.


## Features

- **Homepage:** Overview, impact stats, and quick links to all sections. (Statistics are fetched from Google Sheets.)
- **About:** Mission, vision, history, and timeline of the center.
- **Services:** Details of prosthetic limb and hand services, including hi-tech options.
- **Camps:** Information about past and upcoming prosthetic camps. (Camp data is fetched from Google Sheets.)
- **Gallery:** Photo gallery of center activities, camps, and events. (Photos are fetched dynamically from Google Drive.)
- **Team:** Profiles of the core team and ambassadors.
- **Partners:** List of CSR and outreach partners.
- **Donate:** Secure online donation page for supporters.
- **Contact:** Contact form and center details.
- **Accessibility:** Responsive, mobile-first design for phones and PCs.
- **SEO:** Sitemap, robots.txt, and Open Graph metadata for social sharing.

### Technology
- Built with Next.js App Router, React, and Tailwind CSS.
- Uses modern image optimization (WebP, responsive sizes).
- Framer Motion for smooth animations.
- Lucide icons for a clean, modern look.


## Getting Started

```bash
npm install
npm run dev
```


Open http://localhost:3000.



## Email Setup

The project supports:
- Contact-form email delivery using Resend
- Admin email sending via a secure web interface (no-code)


Add these values to `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxx
OUTBOUND_ADMIN_TOKEN=choose-a-strong-random-token
```


### Notes
- `RESEND_API_KEY` is required for all email delivery.
- Contact form email addresses are hardcoded in `src/app/api/contact/route.ts`.
- `OUTBOUND_ADMIN_TOKEN` is required for admin email access (see below).


## API Endpoints

### Contact Email

- `POST /api/contact`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

### Admin Email Access

- Open `/admin/email` in your browser.
- You will be redirected to `/admin/email/login`.
- Enter the password (`OUTBOUND_ADMIN_TOKEN`) to access the admin email page.
- Fill in recipients, subject, and message body.
- Optional: edit From address, add Reply-To, upload attachments.
- Click Send Email.

This page is for non-technical users to send direct emails without API tools. All emails are sent using Resend and automatically include a Rotary signature block (logo, name, tagline, address, phone, email).

#### API (for advanced users)

- `POST /api/admin/email` (requires authenticated admin session)
- Auth endpoints:
  - `POST /api/admin/auth/login` with `{ "password": "<OUTBOUND_ADMIN_TOKEN>" }`
  - `POST /api/admin/auth/logout`

Request body:

```json
{
  "from": "noreply@rotarydivyangcenter.org",
  "to": "someone@example.com",
  "subject": "Hello from Rotary Divyang Center",
  "text": "Plain text body",
  "html": "<p>HTML body</p>",
  "replyTo": "",
  "attachments": [
    {
      "filename": "notice.pdf",
      "content": "<base64-string>",
      "contentType": "application/pdf"
    }
  ]
}
```

`to` can be a single email string or an array of emails.
`from` must use `@rotarydivyangcenter.org` domain.


## Webhook Removal

The Resend inbound webhook (`/api/resend/inbound`) and related forwarding to Gmail are no longer present in the codebase. All inbound email handling must be managed externally (e.g., via Resend dashboard or Gmail filters).
