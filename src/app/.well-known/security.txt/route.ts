import { SITE_URL } from '@/app/seo';
import { NextResponse } from 'next/server';

export function GET() {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    const content = `Contact: mailto:contact@rotarydivyangcenter.org
Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, 'Z')}
Preferred-Languages: en
Canonical: ${SITE_URL}/.well-known/security.txt
Policy: ${SITE_URL}/security-policy
`;

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}
