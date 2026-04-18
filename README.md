# Rotary Divyang Center Website

Next.js website for Rotary Divyang Center.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Resend Setup

The project supports:

- Contact-form email delivery using Resend

Add these values to `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxx
```

### Notes

- `RESEND_API_KEY` is required.
- Contact form email addresses are hardcoded in `src/app/api/contact/route.ts`.
- `RESEND_WEBHOOK_SECRET` is required for inbound webhook signature verification.

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

## Inbound Forwarding to Gmail (Resend Webhook)

This project includes an inbound webhook endpoint:

- `POST /api/resend/inbound`

Route file:

- `src/app/api/resend/inbound/route.ts`

What it does:

- Verifies Resend webhook signature using `RESEND_WEBHOOK_SECRET`
- Handles `email.received`
- Forwards the exact original inbound email to Gmail (`rcnewkalyan@gmail.com`) using Resend passthrough forwarding

### Dashboard setup

1. Deploy your app to Vercel.
2. In Resend Dashboard, create a webhook endpoint:
	- URL: `https://<your-domain>/api/resend/inbound`
	- Event: `email.received`
3. Copy the webhook signing secret (`whsec_...`) into `RESEND_WEBHOOK_SECRET`.
4. Send a test email to your domain address (for example, `contact@rotarydivyangcenter.org`).
5. Confirm forwarded notification arrives in Gmail.
