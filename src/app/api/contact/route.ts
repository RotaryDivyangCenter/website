import { NextRequest, NextResponse } from 'next/server';
import { getResendClient } from '@/lib/resend';

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

const CONTACT_RECEIVER_EMAIL = 'contact@rotarydivyangcenter.org';
const RESEND_FROM_EMAIL = 'noreply@rotarydivyangcenter.org';
const BRAND_LOGO_URL = 'https://rotarydivyangcenter.org/logo-circular.png';
const BRAND_SITE_URL = 'https://rotarydivyangcenter.org';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildContactEmailHtml(name: string, email: string, message: string): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F7F4EF;font-family:Arial,Helvetica,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F7F4EF;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="background:#17458F;border-radius:16px 16px 0 0;padding:32px 36px;text-align:center;">
            <img src="${BRAND_LOGO_URL}" alt="Rotary Divyang Center" width="64" height="64"
                 style="border-radius:999px;display:block;margin:0 auto 16px;border:3px solid rgba(255,255,255,0.25);" />
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.6);text-transform:uppercase;">Rotary Divyang Center</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">New Contact Form Message</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px 36px;">

            <!-- Sender block -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                   style="background:#F7F4EF;border:1.5px solid #E2DDD6;border-radius:12px;padding:18px 20px;margin-bottom:20px;">
              <tr>
                <td>
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:1.5px;color:#17458F;text-transform:uppercase;">Submitted by</p>
                  <p style="margin:0;font-size:16px;font-weight:700;color:#1A1A2E;">${safeName}</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#5C6475;">
                    <a href="mailto:${safeEmail}" style="color:#17458F;text-decoration:none;">${safeEmail}</a>
                  </p>
                </td>
              </tr>
            </table>

            <!-- Message block -->
            <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:1.5px;color:#17458F;text-transform:uppercase;">Message</p>
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                   style="background:#ffffff;border:1.5px solid #E2DDD6;border-radius:12px;padding:18px 20px;">
              <tr>
                <td>
                  <p style="margin:0;font-size:15px;color:#1A1A2E;line-height:1.7;">${safeMessage}</p>
                </td>
              </tr>
            </table>

            <!-- Reply tip -->
            <p style="margin:24px 0 0;font-size:13px;color:#7C8A97;text-align:center;">
              Hit <strong>Reply</strong> to respond directly to ${safeName}.
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f6f9fc;border-top:1.5px solid #d8e3ee;border-radius:0 0 16px 16px;padding:20px 36px;text-align:center;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#17458F;">Rotary Divyang Center</p>
            <p style="margin:4px 0 8px;font-size:12px;color:#7C8A97;">Giving Hope, Giving Smile &nbsp;·&nbsp; Kalyan West, Maharashtra, India</p>
            <a href="${BRAND_SITE_URL}" style="font-size:12px;color:#17458F;text-decoration:none;">${BRAND_SITE_URL}</a>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

export async function POST(req: NextRequest) {
  let payload: ContactPayload;

  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const name = payload.name?.trim() ?? '';
  const email = payload.email?.trim() ?? '';
  const message = payload.message?.trim() ?? '';

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  try {
    const resend = getResendClient();
    const replyTo = `${name} <${email}>`;

    const result = await resend.emails.send({
      from: `Rotary Divyang Center <${RESEND_FROM_EMAIL}>`,
      to: [CONTACT_RECEIVER_EMAIL],
      replyTo,
      subject: `New Contact Form Message from ${name}`,
      html: buildContactEmailHtml(name, email, message),
    });

    return NextResponse.json({
      success: true,
      id: result.data?.id,
    });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Unable to send message right now.';
    return NextResponse.json({ error: messageText }, { status: 500 });
  }
}
