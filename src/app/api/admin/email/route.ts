import { NextRequest, NextResponse } from 'next/server';
import { getResendClient } from '@/lib/resend';
import { isAdminSessionValid } from '@/lib/adminAuth';
import { addAdminEmailHistory } from '@/lib/adminEmailHistory';

type AdminSendEmailPayload = {
  from?: string;
  to?: string | string[];
  subject?: string;
  text?: string;
  html?: string;
  replyTo?: string;
  attachments?: Array<{
    filename?: string;
    content?: string;
    contentType?: string;
  }>;
};

const DEFAULT_FROM_EMAIL = 'noreply@rotarydivyangcenter.org';
const RESEND_FROM_NAME = 'Rotary Divyang Center';
const BRAND_LOGO_URL = 'https://rotarydivyangcenter.org/logo-circular.png';
const RC_KALYAN_LOGO_URL = 'https://rotarydivyangcenter.org/rcnewkalyan_no_bg.png';
const BRAND_SITE_URL = 'https://rotarydivyangcenter.org';
const BRAND_TAGLINE = 'Giving Hope, Giving Smile';
const BRAND_ADDRESS = 'Kalyan, Maharashtra, India';
const BRAND_PHONE = '+91 9820562796  +91 9819323947';
const BRAND_EMAIL = 'contact@rotarydivyangcenter.org';
const MAX_ATTACHMENTS = 10;

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

function normalizeRecipients(to?: string | string[]): string[] {
  if (typeof to === 'string') {
    return [to.trim()].filter(Boolean);
  }

  if (Array.isArray(to)) {
    return to.map((email) => email.trim()).filter(Boolean);
  }

  return [];
}

function isAuthorized(req: NextRequest): boolean {
  return isAdminSessionValid(req);
}

function normalizeFromAddress(from?: string): string {
  const value = from?.trim() || DEFAULT_FROM_EMAIL;
  if (!isValidEmail(value)) {
    throw new Error('From email is invalid.');
  }

  if (!value.toLowerCase().endsWith('@rotarydivyangcenter.org')) {
    throw new Error('From email must use @rotarydivyangcenter.org domain.');
  }

  return value;
}

function buildTextWithSignature(text: string): string {
  return [
    text,
    '',
    '--',
    RESEND_FROM_NAME,
    BRAND_TAGLINE,
    `Website: ${BRAND_SITE_URL}`,
    `Address: ${BRAND_ADDRESS}`,
    `Phone: ${BRAND_PHONE}`,
    `Email: ${BRAND_EMAIL}`,
  ].join('\n');
}

/** Wraps plain text in a simple HTML body so the branded HTML footer is always included. */
function buildHtmlFromText(text: string): string {
  const lines = escapeHtml(text).split('\n').map((line) => line ? `<p style="margin:0 0 8px;">${line}</p>` : '<br/>').join('');
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1A1A2E;line-height:1.7;">${lines}</div>`;
}

function buildHtmlWithSignature(html: string): string {
  const currentYear = new Date().getFullYear();
  // Inline SVG icons — lucide style, teal #2CA7B0 stroke
  const mapPinSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2CA7B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:7px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>';
  const phoneSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2CA7B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:7px;"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 14.09a16 16 0 006 6l1.37-1.37a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>';
  const mailSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2CA7B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:7px;"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>';
  const globeSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2CA7B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:7px;"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></svg>';

  return `${html}

    <style type="text/css">
      @media only screen and (max-width: 640px) {
        .rdc-footer-wrap { padding: 16px !important; }
        .rdc-stack-col { display: block !important; width: 100% !important; padding: 0 !important; }
        .rdc-divider-col { display: none !important; width: 0 !important; padding: 0 !important; border: 0 !important; }
        .rdc-contact-col { padding-top: 14px !important; border-top: 1px solid #d8e3ee !important; margin-top: 14px !important; }
        .rdc-copyright { padding: 8px 16px !important; }
      }
    </style>

    <!-- Compact Website-style Footer -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
           style="margin-top:28px;font-family:Arial,Helvetica,sans-serif;">
      <tr>
        <td class="rdc-footer-wrap" style="background:#f6f9fc;border-top:1.5px solid #d8e3ee;padding:18px 24px;">

          <!-- Single row: Left = Logo+Name+RC logo | Right = Contact -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>

              <!-- Left: RDC Logo + Name + Tagline + RC Kalyan logo -->
              <td class="rdc-stack-col" style="vertical-align:middle;padding-right:20px;">
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="vertical-align:middle;padding-right:10px;">
                      <a href="${BRAND_SITE_URL}" target="_blank" rel="noreferrer" style="text-decoration:none;">
                        <img src="${BRAND_LOGO_URL}" alt="${RESEND_FROM_NAME}" width="44" height="44"
                             style="border-radius:999px;display:block;border:1px solid #d8e3ee;" />
                      </a>
                    </td>
                    <td style="vertical-align:middle;">
                      <p style="margin:0;font-size:14px;font-weight:700;">
                        <a href="${BRAND_SITE_URL}" target="_blank" rel="noreferrer" style="color:#17458F;text-decoration:none;">${RESEND_FROM_NAME}</a>
                      </p>
                      <p style="margin:2px 0 0;font-size:12px;color:#7C8A97;">${BRAND_TAGLINE}</p>
                    </td>
                  </tr>
                </table>
                <a href="https://rcnewkalyan.rotaryindia.org" target="_blank" rel="noreferrer"
                   style="display:inline-block;margin-top:10px;">
                  <img src="${RC_KALYAN_LOGO_URL}" alt="Rotary Club of New Kalyan" width="124" height="44"
                       style="display:block;object-fit:contain;" />
                </a>
              </td>

              <!-- Vertical divider -->
              <td class="rdc-divider-col" style="border-left:1px solid #d8e3ee;padding:0 20px 0 0;"></td>

              <!-- Right: Contact info -->
              <td class="rdc-stack-col rdc-contact-col" style="vertical-align:middle;padding-left:20px;">
                <p style="margin:0 0 9px;font-size:10px;font-weight:700;letter-spacing:1.5px;color:#17458F;text-transform:uppercase;">Contact</p>
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="padding-bottom:6px;">
                      ${mapPinSvg}<span style="font-size:12px;color:#5A5A5A;vertical-align:middle;line-height:1.45;word-break:break-word;">${BRAND_ADDRESS}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:6px;">
                      ${phoneSvg}
                      <a href="tel:+919820562796" style="font-size:12px;color:#17458F;text-decoration:none;vertical-align:middle;">+91 9820562796</a>
                      <span style="font-size:12px;color:#5A5A5A;vertical-align:middle;">&nbsp;</span>
                      <a href="tel:+919819323947" style="font-size:12px;color:#17458F;text-decoration:none;vertical-align:middle;">+91 9819323947</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:6px;">
                      ${mailSvg}<a href="mailto:${BRAND_EMAIL}" style="font-size:12px;color:#17458F;text-decoration:none;vertical-align:middle;">${BRAND_EMAIL}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:6px;">
                      ${globeSvg}<a href="${BRAND_SITE_URL}" target="_blank" rel="noreferrer" style="font-size:12px;color:#17458F;text-decoration:none;vertical-align:middle;">rotarydivyangcenter.org</a>
                    </td>
                  </tr>
                </table>
              </td>

            </tr>
          </table>

        </td>
      </tr>

      <!-- Copyright bar -->
      <tr>
        <td class="rdc-copyright" style="background:#f6f9fc;border-top:1px solid #d8e3ee;padding:8px 24px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#7C8A97;">© ${currentYear} Rotary Divyang Center. All rights reserved.</p>
        </td>
      </tr>
    </table>`;
}

function normalizeAttachments(input?: AdminSendEmailPayload['attachments']) {
  if (!input?.length) {
    return undefined;
  }

  const prepared = input
    .slice(0, MAX_ATTACHMENTS)
    .map((attachment, index) => {
      const filename = attachment.filename?.trim();
      const content = attachment.content?.trim();

      if (!filename || !content) {
        throw new Error(`Attachment ${index + 1} is missing filename or content.`);
      }

      const cleanType = attachment.contentType?.trim();

      return {
        filename,
        content,
        ...(cleanType ? { contentType: cleanType } : {}),
      };
    });

  return prepared;
}

export async function GET() {
  const sampleBody = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1A1A2E;line-height:1.7;"><p style="margin:0 0 8px;">Hello, this is a preview of your current email footer design.</p><p style="margin:0 0 8px;">Any message sent from the admin tool will include this footer style.</p></div>';
  const previewHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Email Footer Preview</title>
    <style>
      body { margin: 0; background: #f2f4f8; font-family: Arial, Helvetica, sans-serif; color: #1A1A2E; }
      .shell { max-width: 820px; margin: 24px auto; padding: 0 16px; }
      .card { background: #ffffff; border: 1px solid #d8e3ee; border-radius: 14px; overflow: hidden; }
      .head { padding: 12px 16px; border-bottom: 1px solid #e8edf4; font-size: 13px; color: #5C6475; }
      .content { padding: 18px; }
    </style>
  </head>
  <body>
    <div class="shell">
      <div class="card">
        <div class="head">Live preview from /api/admin/email</div>
        <div class="content">${buildHtmlWithSignature(sampleBody)}</div>
      </div>
    </div>
  </body>
</html>`;

  return new NextResponse(previewHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: AdminSendEmailPayload;

  try {
    payload = (await req.json()) as AdminSendEmailPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const to = normalizeRecipients(payload.to);
  let fromEmail: string;
  const subject = payload.subject?.trim() ?? '';
  const text = payload.text?.trim();
  const html = payload.html?.trim();
  const replyTo = payload.replyTo?.trim();
  let attachments: ReturnType<typeof normalizeAttachments>;

  try {
    fromEmail = normalizeFromAddress(payload.from);
    attachments = normalizeAttachments(payload.attachments);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid email payload.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (to.length === 0) {
    return NextResponse.json({ error: 'At least one recipient is required in "to".' }, { status: 400 });
  }

  if (to.some((email) => !isValidEmail(email))) {
    return NextResponse.json({ error: 'One or more recipient emails are invalid.' }, { status: 400 });
  }

  if (!subject) {
    return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
  }

  if (!text && !html) {
    return NextResponse.json({ error: 'Either text or html body is required.' }, { status: 400 });
  }

  if (replyTo && !isValidEmail(replyTo)) {
    return NextResponse.json({ error: 'Invalid replyTo email.' }, { status: 400 });
  }

  try {
    const resend = getResendClient();
    const basePayload = {
      from: `${RESEND_FROM_NAME} <${fromEmail}>`,
      to,
      subject,
      ...(replyTo ? { replyTo } : {}),
      ...(attachments ? { attachments } : {}),
    };

    // Always send HTML so the branded footer renders visually.
    // When only plain text is provided, wrap it in basic HTML.
    const htmlBody = html ? buildHtmlWithSignature(html) : buildHtmlWithSignature(buildHtmlFromText(text!));
    const emailPayload = {
      ...basePayload,
      ...(text ? { text: buildTextWithSignature(text) } : {}),
      html: htmlBody,
    };

    const result = await resend.emails.send(emailPayload);

    addAdminEmailHistory({
      id: result.data?.id || `local-${Date.now()}`,
      sentAt: new Date().toISOString(),
      from: `${RESEND_FROM_NAME} <${fromEmail}>`,
      to,
      subject,
      replyTo: replyTo ? [replyTo] : [],
      status: 'sent',
    });

    return NextResponse.json({
      success: true,
      id: result.data?.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to send email.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
